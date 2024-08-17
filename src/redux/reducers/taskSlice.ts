import { createSlice } from '@reduxjs/toolkit'
import { ITask, TASK_LIST } from '../../models/appModel'
import { taskApi } from '../taskApi'

const INITIAL_STATE = {
    [TASK_LIST.INBOX]: [] as ITask[],
    [TASK_LIST.CLOSED]: [] as ITask[]
}

const taskSlice = createSlice({
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
                state[TASK_LIST.INBOX].unshift(payload)
            }
        )
        builder.addMatcher(
            taskApi.endpoints.closeTask.matchFulfilled,
            (state, { payload }) => {
                state[TASK_LIST.INBOX] = state[TASK_LIST.INBOX].filter(task => task.id !== payload.id)
                state[TASK_LIST.CLOSED].unshift(payload)
            }
        )
        builder.addMatcher(
            taskApi.endpoints.undoCloseTask.matchFulfilled,
            (state, { payload }) => {
                state[TASK_LIST.CLOSED] = state[TASK_LIST.CLOSED].filter(task => task.id !== payload.id)
                state[TASK_LIST.INBOX].unshift(payload)
            }
        )
        builder.addMatcher(
            taskApi.endpoints.updateTask.matchFulfilled,
            (state, { payload }) => {
                const currentTaskList = payload.closed ? TASK_LIST.CLOSED : TASK_LIST.INBOX
                state[currentTaskList] = state[currentTaskList].map(task => task.id === payload.id ? payload : task)
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

export default taskSlice.reducer