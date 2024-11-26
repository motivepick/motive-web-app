import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
    FetchTaskListQueryParams,
    ISearchUserTasksResponse,
    ITask,
    RescheduleTaskRequest,
    SCHEDULE_TASK_LIST_IDS,
    SCHEDULE_WEEK_TASK_LIST_IDS,
    TASK_LIST_ID,
    TaskListsState,
    TaskListState,
    TaskPositionChange
} from '../../models/appModel'
import { api } from '../api'
import { AppDispatch, RootState } from '../store'
import fetchClient from '../../fetchClient'
import { selectTaskList } from '../selectors/selectors'
import { DateTime } from 'luxon'

const emptyTaskList = (): TaskListState => ({
    status: 'IDLE',
    totalElements: 0,
    allIds: [],
    meta: { fromIncl: DateTime.fromObject({ year: 0 }), untilExcl: DateTime.fromObject({ year: 9999 }) }
})

const INITIAL_STATE: TaskListsState = {
    taskListId: TASK_LIST_ID.INBOX,
    taskLists: {
        [TASK_LIST_ID.INBOX]: emptyTaskList(),
        [TASK_LIST_ID.CLOSED]: emptyTaskList(),
        [TASK_LIST_ID.SCHEDULE_0]: emptyTaskList(),
        [TASK_LIST_ID.SCHEDULE_1]: emptyTaskList(),
        [TASK_LIST_ID.SCHEDULE_2]: emptyTaskList(),
        [TASK_LIST_ID.SCHEDULE_3]: emptyTaskList(),
        [TASK_LIST_ID.SCHEDULE_4]: emptyTaskList(),
        [TASK_LIST_ID.SCHEDULE_5]: emptyTaskList(),
        [TASK_LIST_ID.SCHEDULE_6]: emptyTaskList(),
        [TASK_LIST_ID.SCHEDULE_OVERDUE]: emptyTaskList(),
        [TASK_LIST_ID.SCHEDULE_FUTURE]: emptyTaskList()
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

export const updateScheduleTasksOrder = createAppAsyncThunk('tasks/updateScheduleTasksOrder', async (payload: TaskPositionChange, { getState }) => {
    const state = getState()
    const { taskLists } = state.tasks
    const taskIds = SCHEDULE_TASK_LIST_IDS
        .map(id => taskLists[id])
        .flatMap(it => it.allIds)
    const { taskId, destinationListId } = payload
    const body: RescheduleTaskRequest = { taskIds, dueDate: taskLists[destinationListId].meta.fromIncl.toUTC() }
    const response = await fetchClient.post<ITask>(`/tasks/${taskId}/reschedule`, body)
    return response.data
})

const isScheduledTo = (task: ITask, fromIncl: DateTime, untilExcl: DateTime) => {
    if (task.dueDate) {
        const dueDate = DateTime.fromISO(task.dueDate, { zone: 'utc' }).toLocal()
        return fromIncl <= dueDate && dueDate < untilExcl
    }
    return false
}

const removeTask = (taskList: TaskListState, taskId: number) => {
    taskList.allIds = taskList.allIds.filter(it => it !== taskId)
}

const addTaskIfScheduled = (taskList: TaskListState, task: ITask, addFn: 'unshift' | 'push') => {
    const { fromIncl, untilExcl } = taskList.meta
    if (fromIncl && untilExcl && isScheduledTo(task, fromIncl, untilExcl)) {
        taskList.allIds[addFn](task.id)
    }
}

const prependTaskIfScheduled = (taskList: TaskListState, task: ITask) =>
    addTaskIfScheduled(taskList, task, 'unshift')

const appendTaskIfScheduled = (taskList: TaskListState, task: ITask) =>
    addTaskIfScheduled(taskList, task, 'push')

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
            .addCase(updateScheduleTasksOrder.pending, (state, { meta }) => {
                const { sourceListId, taskId, destinationListId, destinationIndex } = meta.arg
                state.taskLists[sourceListId].totalElements -= 1
                removeTask(state.taskLists[sourceListId], taskId)
                state.taskLists[destinationListId].totalElements += 1
                state.taskLists[destinationListId].allIds.splice(destinationIndex, 0, taskId)
            })
            .addCase(updateScheduleTasksOrder.fulfilled, (state, { payload }) => {
                const task = state.byId[payload.id]
                task.dueDate = payload.dueDate
            })
            .addMatcher(api.endpoints.fetchSchedule.matchFulfilled, (state, { payload }) => {
                payload.forEach(it => state.byId[it.id] = it)
                const startOfToday = DateTime.now().startOf('day')
                SCHEDULE_TASK_LIST_IDS.forEach(it => {
                    if (it === TASK_LIST_ID.SCHEDULE_OVERDUE) {
                        state.taskLists[it].meta = {
                            fromIncl: DateTime.fromObject({ year: 0 }),
                            untilExcl: startOfToday
                        }
                    } else if (it === TASK_LIST_ID.SCHEDULE_FUTURE) {
                        state.taskLists[it].meta = {
                            fromIncl: startOfToday.plus({ days: SCHEDULE_WEEK_TASK_LIST_IDS.length }),
                            untilExcl: DateTime.fromObject({ year: 9999 })
                        }
                    } else {
                        const fromIncl = startOfToday.plus({ days: SCHEDULE_WEEK_TASK_LIST_IDS.indexOf(it) })
                        state.taskLists[it].meta = {
                            fromIncl,
                            untilExcl: fromIncl.plus({ days: 1 })
                        }
                    }
                    state.taskLists[it].status = 'SUCCEEDED'
                    payload.forEach(task => appendTaskIfScheduled(state.taskLists[it], task))
                    state.taskLists[it].totalElements = state.taskLists[it].allIds.length
                })
            })
            .addMatcher(api.endpoints.createTask.matchFulfilled, (state, { payload }) => {
                const taskList = state.taskLists[TASK_LIST_ID.INBOX]
                taskList.totalElements += 1
                taskList.allIds.unshift(payload.id)
                state.byId[payload.id] = payload
                if (state.taskLists[TASK_LIST_ID.SCHEDULE_0].status === 'SUCCEEDED' && payload.dueDate) {
                    SCHEDULE_TASK_LIST_IDS.forEach(it => prependTaskIfScheduled(state.taskLists[it], payload))
                }
            })
            .addMatcher(api.endpoints.closeTask.matchFulfilled, (state, { payload }) => {
                state.taskLists[TASK_LIST_ID.INBOX].totalElements -= 1
                removeTask(state.taskLists[TASK_LIST_ID.INBOX], payload.id)
                if (state.taskLists[TASK_LIST_ID.CLOSED].status === 'SUCCEEDED') {
                    state.taskLists[TASK_LIST_ID.CLOSED].totalElements += 1
                    state.taskLists[TASK_LIST_ID.CLOSED].allIds.unshift(payload.id)
                }
                if (state.taskLists[TASK_LIST_ID.SCHEDULE_0].status === 'SUCCEEDED' && payload.dueDate) {
                    SCHEDULE_TASK_LIST_IDS.forEach(it => removeTask(state.taskLists[it], payload.id))
                }
            })
            .addMatcher(api.endpoints.reopenTask.matchFulfilled, (state, { payload }) => {
                state.taskLists[TASK_LIST_ID.CLOSED].totalElements -= 1
                removeTask(state.taskLists[TASK_LIST_ID.CLOSED], payload.id)
                if (state.taskLists[TASK_LIST_ID.INBOX].status === 'SUCCEEDED') {
                    state.taskLists[TASK_LIST_ID.INBOX].totalElements += 1
                    state.taskLists[TASK_LIST_ID.INBOX].allIds.unshift(payload.id)
                }
                if (state.taskLists[TASK_LIST_ID.SCHEDULE_0].status === 'SUCCEEDED' && payload.dueDate) {
                    SCHEDULE_TASK_LIST_IDS.forEach(it => prependTaskIfScheduled(state.taskLists[it], payload))
                }
            })
            .addMatcher(api.endpoints.updateTask.matchFulfilled, (state, { payload }) => {
                if (state.taskLists[TASK_LIST_ID.SCHEDULE_0].status === 'SUCCEEDED' && state.byId[payload.id].dueDate !== payload.dueDate) {
                    SCHEDULE_TASK_LIST_IDS.forEach(it => {
                        removeTask(state.taskLists[it], payload.id)
                        prependTaskIfScheduled(state.taskLists[it], payload)
                    })
                }
                state.byId[payload.id] = payload
            })
            .addMatcher(api.endpoints.updateTasksOrderAsync.matchPending, (state, { meta }) => {
                const { sourceListId, taskId, destinationListId, destinationIndex } = meta.arg.originalArgs
                removeTask(state.taskLists[sourceListId], taskId)
                state.taskLists[destinationListId].allIds.splice(destinationIndex, 0, taskId)
            })
    }
})

export const { toggleTaskListId, setTaskListId, resetTaskLists } = tasksSlice.actions
export default tasksSlice.reducer
