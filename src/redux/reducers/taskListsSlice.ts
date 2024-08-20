import { createSlice } from '@reduxjs/toolkit'
import { TASK_LIST_ID, TaskListsState } from '../../models/appModel'
import { api } from '../api'

const INITIAL_STATE = {
    taskListId: TASK_LIST_ID.INBOX,
    taskLists: {
        [TASK_LIST_ID.INBOX]: { initialized: false, totalElements: 0, allIds: [] },
        [TASK_LIST_ID.CLOSED]: { initialized: false, totalElements: 0, allIds: [] }
    },
    byId: {}
}

const TASK_LIST_IDS_TO_TOGGLE: string[] = [TASK_LIST_ID.INBOX, TASK_LIST_ID.CLOSED]

const taskListsSlice = createSlice({
    name: 'taskLists',
    initialState: INITIAL_STATE as TaskListsState,
    reducers: {
        toggleTaskListId(state) {
            state.taskListId = TASK_LIST_IDS_TO_TOGGLE[(TASK_LIST_IDS_TO_TOGGLE.indexOf(state.taskListId) + 1) % TASK_LIST_IDS_TO_TOGGLE.length]
        },
        setTaskListId(state, { payload }) {
            state.taskListId = payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                api.endpoints.fetchTaskList.matchFulfilled,
                (state, { payload, meta }) => {
                    const { taskListId } = meta.arg.originalArgs
                    state.taskLists[taskListId].initialized = true
                    state.taskLists[taskListId].totalElements = payload.page.totalElements
                    state.taskLists[taskListId].allIds.push(...payload.content.map(it => it.id))
                    state.byId = { ...state.byId, ...Object.fromEntries(payload.content.map((t) => [t.id, t])) }
                }
            )
            .addMatcher(
                api.endpoints.createTask.matchFulfilled,
                (state) => {
                    state.taskLists[TASK_LIST_ID.INBOX].totalElements += 1
                }
            )
            .addMatcher(
                api.endpoints.closeTask.matchFulfilled,
                (state) => {
                    state.taskLists[TASK_LIST_ID.INBOX].totalElements -= 1
                    state.taskLists[TASK_LIST_ID.CLOSED].totalElements += 1
                }
            )
            .addMatcher(
                api.endpoints.reopenTask.matchFulfilled,
                (state) => {
                    state.taskLists[TASK_LIST_ID.INBOX].totalElements += 1
                    state.taskLists[TASK_LIST_ID.CLOSED].totalElements -= 1
                }
            )
    }
})

export const { toggleTaskListId, setTaskListId } = taskListsSlice.actions
export default taskListsSlice.reducer
