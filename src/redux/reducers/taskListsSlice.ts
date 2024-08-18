import { createSlice } from '@reduxjs/toolkit'
import { TASK_LIST_ID } from '../../models/appModel'
import { taskApi } from '../taskApi'

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
        builder.addMatcher(
            taskApi.endpoints.searchInboxTasks.matchFulfilled,
            (state, { payload }) => {
                state.totalElementsINBOX = payload.page.totalElements
            }
        )
        builder.addMatcher(
            taskApi.endpoints.searchClosedTasks.matchFulfilled,
            (state, { payload }) => {
                state.totalElementsCLOSED = payload.page.totalElements
            }
        )
        builder.addMatcher(
            taskApi.endpoints.createTask.matchFulfilled,
            (state) => {
                state.totalElementsINBOX += 1
            }
        )
        builder.addMatcher(
            taskApi.endpoints.closeTask.matchFulfilled,
            (state) => {
                state.totalElementsINBOX -= 1
                state.totalElementsCLOSED += 1
            }
        )
        builder.addMatcher(
            taskApi.endpoints.reopenTask.matchFulfilled,
            (state) => {
                state.totalElementsINBOX += 1
                state.totalElementsCLOSED -= 1
            }
        )
    }
})

export const { toggleTaskListId, setTaskListIdToInbox } = taskListsSlice.actions
export default taskListsSlice.reducer
