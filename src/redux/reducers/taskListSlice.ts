import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TASK_LIST } from '../../models/appModel'
import { taskApi } from '../taskApi'

const INITIAL_STATE = {
    currentList: TASK_LIST.INBOX,
    totalElementsINBOX: 0,
    totalElementsCLOSED: 0
}

const taskSlice = createSlice({
    name: 'taskLists',
    initialState: INITIAL_STATE,
    reducers: {
        setCurrentList(state, action: PayloadAction<TASK_LIST>) {
            state.currentList = action.payload
        },
        toggleCurrentTaskList(state) {
            state.currentList = state.currentList === TASK_LIST.INBOX ? TASK_LIST.CLOSED : TASK_LIST.INBOX
        },
        setCurrentTaskListToInbox(state) {
            state.currentList = TASK_LIST.INBOX
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
            (state, { payload }) => {
                state.totalElementsINBOX += 1
            }
        )
        builder.addMatcher(
            taskApi.endpoints.closeTask.matchFulfilled,
            (state, { payload }) => {
                state.totalElementsINBOX -= 1
                state.totalElementsCLOSED += 1
            }
        )
        builder.addMatcher(
            taskApi.endpoints.undoCloseTask.matchFulfilled,
            (state, { payload }) => {
                state.totalElementsINBOX += 1
                state.totalElementsCLOSED -= 1
            }
        )
    }
})

export const { setCurrentList, toggleCurrentTaskList, setCurrentTaskListToInbox } = taskSlice.actions
export default taskSlice.reducer