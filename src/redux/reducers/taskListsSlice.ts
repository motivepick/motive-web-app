import { createSlice } from '@reduxjs/toolkit'
import { TASK_LIST_ID } from '../../models/appModel'
import { api } from '../api'

const INITIAL_STATE = {
    taskListId: TASK_LIST_ID.INBOX,
    totalElementsINBOX: 0,
    totalElementsCLOSED: 0
}

const TASK_LIST_IDS_TO_TOGGLE = [TASK_LIST_ID.INBOX, TASK_LIST_ID.CLOSED]

const taskListsSlice = createSlice({
    name: 'taskLists',
    initialState: INITIAL_STATE,
    reducers: {
        toggleTaskListId(state) {
            state.taskListId = TASK_LIST_IDS_TO_TOGGLE[(TASK_LIST_IDS_TO_TOGGLE.indexOf(state.taskListId) + 1) % TASK_LIST_IDS_TO_TOGGLE.length]
        },
        setTaskListIdToInbox(state) {
            state.taskListId = TASK_LIST_ID.INBOX
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                api.endpoints.fetchInboxTasks.matchFulfilled,
                (state, { payload }) => {
                    state.totalElementsINBOX = payload.page.totalElements
                }
            )
            .addMatcher(
                api.endpoints.fetchClosedTasks.matchFulfilled,
                (state, { payload }) => {
                    state.totalElementsCLOSED = payload.page.totalElements
                }
            )
            .addMatcher(
                api.endpoints.createTask.matchFulfilled,
                (state) => {
                    state.totalElementsINBOX += 1
                }
            )
            .addMatcher(
                api.endpoints.closeTask.matchFulfilled,
                (state) => {
                    state.totalElementsINBOX -= 1
                    state.totalElementsCLOSED += 1
                }
            )
            .addMatcher(
                api.endpoints.reopenTask.matchFulfilled,
                (state) => {
                    state.totalElementsINBOX += 1
                    state.totalElementsCLOSED -= 1
                }
            )
    }
})

export const { toggleTaskListId, setTaskListIdToInbox } = taskListsSlice.actions
export default taskListsSlice.reducer
