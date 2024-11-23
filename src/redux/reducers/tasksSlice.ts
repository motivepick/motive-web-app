import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
    FetchTaskListQueryParams,
    ISearchUserTasksResponse,
    ITask,
    RescheduleTaskRequest,
    SCHEDULE_WEEK_TASK_LIST_IDS,
    TASK_LIST_ID,
    TaskListsState,
    TaskPositionChange
} from '../../models/appModel'
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

export const updateScheduleTasksOrder = createAppAsyncThunk('tasks/updateScheduleTasksOrder', async (payload: TaskPositionChange, { getState, dispatch }) => {
    dispatch(updateScheduleTasksPositions(payload))
    const state = getState()
    const { taskLists } = state.tasks
    const taskIds = [TASK_LIST_ID.SCHEDULE_OVERDUE, ...SCHEDULE_WEEK_TASK_LIST_IDS, TASK_LIST_ID.SCHEDULE_FUTURE]
        .map(id => taskLists[id])
        .flatMap(it => it.allIds)
    const { taskId, destinationListId } = payload
    const body: RescheduleTaskRequest = { taskIds, dueDate: taskLists[destinationListId].meta.day.toUTC() }
    const response = await fetchClient.post<ITask>(`/tasks/${taskId}/reschedule`, body)
    dispatch(updateTaskDueDate(response.data))
    return response.data
})

const isScheduledTo = (task: ITask, startOfDay: DateTime<Valid> | DateTime<Invalid>) => {
    if (task.dueDate) {
        const dueDate = DateTime.fromISO(task.dueDate, { zone: 'utc' }).toLocal()
        return startOfDay <= dueDate && dueDate < startOfDay.plus({ days: 1 })
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
            const { sourceListId, taskId, destinationListId, destinationIndex } = payload
            state.taskLists[sourceListId].totalElements -= 1
            state.taskLists[sourceListId].allIds = state.taskLists[sourceListId].allIds.filter(it => it !== taskId)
            state.taskLists[destinationListId].totalElements += 1
            state.taskLists[destinationListId].allIds.splice(destinationIndex, 0, taskId)
        },
        updateTaskDueDate: (state, { payload }) => {
            const task = state.byId[payload.id]
            task.dueDate = payload.dueDate
        }
    },
    extraReducers: builder => {
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
                const startOfToday = DateTime.now().startOf('day')
                const days = Array
                    .from(Array(SCHEDULE_WEEK_TASK_LIST_IDS.length).keys())
                    .map(i => startOfToday.plus({ days: i }))
                const overdueTasks = payload.filter(task => task.dueDate && DateTime.fromISO(task.dueDate, { zone: 'utc' }).toLocal() < startOfToday)
                state.taskLists[TASK_LIST_ID.SCHEDULE_OVERDUE] = {
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
                const startOfNextWeek = startOfToday.plus({ days: days.length })
                const futureTasks = payload.filter(task => task.dueDate && DateTime.fromISO(task.dueDate, { zone: 'utc' }).toLocal() >= startOfNextWeek)
                state.taskLists[TASK_LIST_ID.SCHEDULE_FUTURE] = {
                    status: 'SUCCEEDED',
                    totalElements: futureTasks.length,
                    allIds: futureTasks.map(it => it.id),
                    meta: { day: startOfNextWeek }
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
                state.taskLists[TASK_LIST_ID.INBOX].allIds = state.taskLists[TASK_LIST_ID.INBOX].allIds.filter(it => it !== payload.id)
                if (state.taskLists[TASK_LIST_ID.CLOSED].status === 'SUCCEEDED') {
                    state.taskLists[TASK_LIST_ID.CLOSED].totalElements += 1
                    state.taskLists[TASK_LIST_ID.CLOSED].allIds.unshift(payload.id)
                }
            })
            .addMatcher(api.endpoints.reopenTask.matchFulfilled, (state, { payload }) => {
                state.taskLists[TASK_LIST_ID.CLOSED].totalElements -= 1
                state.taskLists[TASK_LIST_ID.CLOSED].allIds = state.taskLists[TASK_LIST_ID.CLOSED].allIds.filter(it => it !== payload.id)
                if (state.taskLists[TASK_LIST_ID.INBOX].status === 'SUCCEEDED') {
                    state.taskLists[TASK_LIST_ID.INBOX].totalElements += 1
                    state.taskLists[TASK_LIST_ID.INBOX].allIds.unshift(payload.id)
                }
            })
            .addMatcher(api.endpoints.updateTask.matchFulfilled, (state, { payload }) => {
                state.byId[payload.id] = payload
            })
            .addMatcher(api.endpoints.updateTasksOrderAsync.matchPending, (state, { meta }) => {
                const { sourceListId, taskId, destinationListId, destinationIndex } = meta.arg.originalArgs
                state.taskLists[sourceListId].allIds = state.taskLists[sourceListId].allIds.filter(it => it !== taskId)
                state.taskLists[destinationListId].allIds.splice(destinationIndex, 0, taskId)
            })
    }
})

export const { toggleTaskListId, setTaskListId, resetTaskLists, updateScheduleTasksPositions, updateTaskDueDate } = tasksSlice.actions
export default tasksSlice.reducer
