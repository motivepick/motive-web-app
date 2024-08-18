import { createSlice } from '@reduxjs/toolkit'
import { ITask, TASK_LIST_ID } from '../../models/appModel'
import { taskApi } from '../taskApi'

const INITIAL_STATE = {
    [TASK_LIST_ID.INBOX]: [] as ITask[],
    [TASK_LIST_ID.CLOSED]: [] as ITask[]
}

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: INITIAL_STATE,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            taskApi.endpoints.searchInboxTasks.matchFulfilled,
            (state, { payload }) => {
                state.INBOX = state.INBOX.concat(payload.content)
            }
        )
        builder.addMatcher(
            taskApi.endpoints.searchClosedTasks.matchFulfilled,
            (state, { payload }) => {
                state.CLOSED = state.CLOSED.concat(payload.content)
            }
        )
        builder.addMatcher(
            taskApi.endpoints.createTask.matchFulfilled,
            (state, { payload }) => {
                state[TASK_LIST_ID.INBOX].unshift(payload)
            }
        )
        builder.addMatcher(
            taskApi.endpoints.closeTask.matchFulfilled,
            (state, { payload }) => {
                state[TASK_LIST_ID.INBOX] = state[TASK_LIST_ID.INBOX].filter(task => task.id !== payload.id)
                state[TASK_LIST_ID.CLOSED].unshift(payload)
            }
        )
        builder.addMatcher(
            taskApi.endpoints.reopenTask.matchFulfilled,
            (state, { payload }) => {
                state[TASK_LIST_ID.CLOSED] = state[TASK_LIST_ID.CLOSED].filter(task => task.id !== payload.id)
                state[TASK_LIST_ID.INBOX].unshift(payload)
            }
        )
        builder.addMatcher(
            taskApi.endpoints.updateTask.matchFulfilled,
            (state, { payload }) => {
                const taskListId = payload.closed ? TASK_LIST_ID.CLOSED : TASK_LIST_ID.INBOX
                state[taskListId] = state[taskListId].map(task => task.id === payload.id ? payload : task)
            }
        )
        builder.addMatcher(
            taskApi.endpoints.updateTasksOrderAsync.matchPending,
            (state, { meta }) => {
                const { sourceListType, sourceIndex, destinationListType, destinationIndex } = meta.arg.originalArgs
                const task = state[sourceListType][sourceIndex]
                state[sourceListType].splice(sourceIndex, 1)
                state[destinationListType].splice(destinationIndex, 0, task)
            }
        )
    }
})

export default tasksSlice.reducer
