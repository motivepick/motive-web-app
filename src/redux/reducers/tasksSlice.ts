import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { FetchTaskListQueryParams, IPage, ISearchUserTasksResponse, ITask, ITaskPositionIndex, TASK_LIST_ID, TaskListsState } from '../../models/appModel'
import { api } from '../api'
import { AppDispatch, RootState } from '../store'
import fetchClient from '../../fetchClient'
import { selectTaskList } from '../selectors/selectors'
import { DateTime } from 'luxon'
import { Invalid, Valid } from 'luxon/src/_util'

const INITIAL_STATE: TaskListsState = {
    taskListId: TASK_LIST_ID.INBOX,
    taskLists: {
        [TASK_LIST_ID.INBOX]: { status: 'IDLE', totalElements: 0, allIds: [] },
        [TASK_LIST_ID.CLOSED]: { status: 'IDLE', totalElements: 0, allIds: [] }
    },
    byId: {}
}

const TASK_LIST_IDS_TO_TOGGLE: string[] = [TASK_LIST_ID.INBOX, TASK_LIST_ID.CLOSED]

export const createAppAsyncThunk = createAsyncThunk.withTypes<{ state: RootState, dispatch: AppDispatch }>()

export const fetchTaskLists = createAppAsyncThunk('tasks/fetchTaskList', async (queryParams: FetchTaskListQueryParams) => {
        const params = { offset: queryParams.offset, limit: queryParams.limit }
        const response = await fetchClient.get<ISearchUserTasksResponse>(`/task-lists/${queryParams.type}`, { params })
        return response.data
    },
    {
        condition: ({ type, offset }, { getState }) => selectTaskList(getState(), type).status === 'IDLE' || offset > 0
    }
)

export const updateScheduleTasksOrder = createAppAsyncThunk('tasks/updateScheduleTasksOrder', async (payload: ITaskPositionIndex, { getState, dispatch }) => {
    dispatch(updateScheduleTasksPositions(payload))
    // TODO: dispatch dueDate update here
    const state = getState()
    const weekTaskIds: number[] = Array
        .from(Array(7).keys())
        .reduce((acc: number[], key: number) => acc.concat(state.tasks.taskLists[`SCHEDULE_${key}`].allIds), [])
    const tasks = [...state.tasks.taskLists['OVERDUE'].allIds, ...weekTaskIds, ...state.tasks.taskLists['FUTURE'].allIds]
    console.log('AFTER DISPATCH', tasks)
    // const params = { offset: payload.offset, limit: payload.limit }
    // const response = await fetchClient.get<ISearchUserTasksResponse>(`/task-lists/${payload.type}`, { params })
    return {
        content: [],
        page: {
            size: 0,
            number: 0,
            totalElements: 0,
            totalPages: 0
        }
    }
})

const isScheduledTo = (task: ITask, startOfDayUtc: DateTime<Valid> | DateTime<Invalid>) => {
    if (task.dueDate) {
        const dueDate = DateTime.fromISO(task.dueDate, { zone: 'utc' })
        return startOfDayUtc <= dueDate && dueDate < startOfDayUtc.plus({ days: 1 })
    }
    return false
}

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: INITIAL_STATE,
    reducers: {
        setTaskListId: (state, { payload }) => {
            state.taskListId = payload
        },
        toggleTaskListId: (state) => {
            state.taskListId = TASK_LIST_IDS_TO_TOGGLE[(TASK_LIST_IDS_TO_TOGGLE.indexOf(state.taskListId) + 1) % TASK_LIST_IDS_TO_TOGGLE.length]
        },
        resetTaskLists: (state) => {
            state.taskLists = INITIAL_STATE.taskLists
            state.byId = INITIAL_STATE.byId
        },
        updateScheduleTasksPositions: (state, { payload }) => {
            const { sourceListType, taskId, destinationListType, destinationIndex } = payload
            state.taskLists[sourceListType].allIds = state.taskLists[sourceListType].allIds.filter(it => it != taskId)
            state.taskLists[destinationListType].allIds.splice(destinationIndex, 0, taskId)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTaskLists.pending, (state, { meta }) => {
                const taskListId = meta.arg.type
                state.taskLists[taskListId].status = 'PENDING'
            })
            .addCase(fetchTaskLists.fulfilled, (state, { payload, meta }) => {
                const taskListId = meta.arg.type
                const taskList = state.taskLists[taskListId]
                taskList.status = 'SUCCEEDED'
                taskList.totalElements = payload.page.totalElements
                taskList.allIds.push(...payload.content.map(it => it.id))
                payload.content.forEach(it => state.byId[it.id] = it)
            })
            .addCase(fetchTaskLists.rejected, (state, { meta }) => {
                const taskListId = meta.arg.type
                state.taskLists[taskListId].status = 'FAILED'
            })
            .addMatcher(api.endpoints.fetchSchedule.matchFulfilled, (state, { payload }) => {
                payload.forEach(it => state.byId[it.id] = it)
                const startOfTodayUtc = DateTime.utc().startOf('day')
                const days = Array
                    .from(Array(7).keys())
                    .map(i => startOfTodayUtc.plus({ days: i }))
                const overdueTasks = payload.filter(task => task.dueDate && DateTime.fromISO(task.dueDate, { zone: 'utc' }) < startOfTodayUtc)
                state.taskLists['OVERDUE'] = {
                    status: 'SUCCEEDED',
                    totalElements: overdueTasks.length,
                    allIds: overdueTasks.map(it => it.id)
                }
                days.forEach((day, index) => {
                    const tasks = payload.filter(task => isScheduledTo(task, day))
                    state.taskLists[`SCHEDULE_${index}`] = {
                        status: 'SUCCEEDED',
                        totalElements: tasks.length,
                        allIds: tasks.map(it => it.id),
                        meta: { day }
                    }
                })
                const startOfNextWeekUtc = startOfTodayUtc.plus({ days: days.length })
                const futureTasks = payload.filter(task => task.dueDate && DateTime.fromISO(task.dueDate, { zone: 'utc' }) >= startOfNextWeekUtc)
                state.taskLists['FUTURE'] = {
                    status: 'SUCCEEDED',
                    totalElements: futureTasks.length,
                    allIds: futureTasks.map(it => it.id)
                }
            })
            .addMatcher(api.endpoints.createTask.matchFulfilled, (state, { payload }) => {
                const taskList = state.taskLists[TASK_LIST_ID.INBOX]
                taskList.totalElements += 1
                taskList.allIds.unshift(payload.id)
                state.byId[payload.id] = payload
            })
            .addMatcher(api.endpoints.closeTask.matchFulfilled, (state, { payload }) => {
                state.taskLists[TASK_LIST_ID.INBOX].totalElements -= 1
                state.taskLists[TASK_LIST_ID.INBOX].allIds = state.taskLists[TASK_LIST_ID.INBOX].allIds.filter(it => it != payload.id)
                if (state.taskLists[TASK_LIST_ID.CLOSED].status === 'SUCCEEDED') {
                    state.taskLists[TASK_LIST_ID.CLOSED].totalElements += 1
                    state.taskLists[TASK_LIST_ID.CLOSED].allIds.unshift(payload.id)
                }
            })
            .addMatcher(api.endpoints.reopenTask.matchFulfilled, (state, { payload }) => {
                state.taskLists[TASK_LIST_ID.CLOSED].totalElements -= 1
                state.taskLists[TASK_LIST_ID.CLOSED].allIds = state.taskLists[TASK_LIST_ID.CLOSED].allIds.filter(it => it != payload.id)
                if (state.taskLists[TASK_LIST_ID.INBOX].status === 'SUCCEEDED') {
                    state.taskLists[TASK_LIST_ID.INBOX].totalElements += 1
                    state.taskLists[TASK_LIST_ID.INBOX].allIds.unshift(payload.id)
                }
            })
            .addMatcher(api.endpoints.updateTask.matchFulfilled, (state, { payload }) => {
                state.byId[payload.id] = payload
            })
            .addMatcher(api.endpoints.updateTasksOrderAsync.matchPending, (state, { meta }) => {
                // const { sourceListType, taskId, destinationListType, destinationIndex } = meta.arg.originalArgs
                // state.taskLists[sourceListType].allIds = state.taskLists[sourceListType].allIds.filter(it => it != taskId)
                // state.taskLists[destinationListType].allIds.splice(destinationIndex, 0, taskId)
            })
            .addMatcher(api.endpoints.updateTasksOrderAsync.matchFulfilled, (state, { payload }) => {
                // state.byId[payload.id] = payload
            })
    }
})

export const { toggleTaskListId, setTaskListId, resetTaskLists, updateScheduleTasksPositions } = tasksSlice.actions
export default tasksSlice.reducer
