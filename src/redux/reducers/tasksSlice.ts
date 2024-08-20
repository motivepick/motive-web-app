import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { FetchTaskListQueryParams, TASK_LIST_ID, TaskListsState } from '../../models/appModel'
import { api } from '../api'
import { AppDispatch, RootState } from '../store'
import fetchClient from '../../fetchClient'
import { ISearchUserTasksResponse } from '../../models/redux/taskServiceModel'

const INITIAL_STATE = {
    taskListId: TASK_LIST_ID.INBOX,
    taskLists: {
        [TASK_LIST_ID.INBOX]: { initialized: false, totalElements: 0, allIds: [] },
        [TASK_LIST_ID.CLOSED]: { initialized: false, totalElements: 0, allIds: [] }
    },
    byId: {}
}

const TASK_LIST_IDS_TO_TOGGLE: string[] = [TASK_LIST_ID.INBOX, TASK_LIST_ID.CLOSED]

export const createAppAsyncThunk = createAsyncThunk.withTypes<{ state: RootState, dispatch: AppDispatch }>()

export const fetchTaskLists = createAppAsyncThunk('tasks/fetchTaskList', async (queryParams: FetchTaskListQueryParams) => {
    const params = { offset: queryParams.offset, limit: queryParams.limit }
    const response = await fetchClient.get<ISearchUserTasksResponse>(`/task-lists/${queryParams.type}`, { params, withCredentials: true })
    return response.data
})

const tasksSlice = createSlice({
    name: 'tasks',
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
            .addCase(
                fetchTaskLists.fulfilled,
                (state, { payload }) => {
                    const taskList = state.taskLists[state.taskListId]
                    taskList.initialized = true
                    taskList.totalElements = payload.page.totalElements
                    taskList.allIds.push(...payload.content.map(it => it.id))
                    state.byId = { ...state.byId, ...Object.fromEntries(payload.content.map((t) => [t.id, t])) }
                }
            )
            .addMatcher(
                api.endpoints.createTask.matchFulfilled,
                (state, { payload }) => {
                    const taskList = state.taskLists[TASK_LIST_ID.INBOX]
                    taskList.totalElements += 1
                    taskList.allIds = [payload.id, ...taskList.allIds]
                    state.byId = { ...state.byId, ...{ [payload.id]: payload } }
                }
            )
            .addMatcher(
                api.endpoints.closeTask.matchFulfilled,
                (state, { payload }) => {
                    state.taskLists[TASK_LIST_ID.INBOX].totalElements -= 1
                    state.taskLists[TASK_LIST_ID.CLOSED].totalElements += 1
                    state.taskLists[TASK_LIST_ID.INBOX].allIds = state.taskLists[TASK_LIST_ID.INBOX].allIds.filter(it => it != payload.id)
                    state.taskLists[TASK_LIST_ID.CLOSED].allIds = [payload.id, ...state.taskLists[TASK_LIST_ID.CLOSED].allIds]
                }
            )
            .addMatcher(
                api.endpoints.reopenTask.matchFulfilled,
                (state, { payload }) => {
                    state.taskLists[TASK_LIST_ID.INBOX].totalElements += 1
                    state.taskLists[TASK_LIST_ID.CLOSED].totalElements -= 1
                    state.taskLists[TASK_LIST_ID.INBOX].allIds = [payload.id, ...state.taskLists[TASK_LIST_ID.INBOX].allIds]
                    state.taskLists[TASK_LIST_ID.CLOSED].allIds = state.taskLists[TASK_LIST_ID.CLOSED].allIds.filter(it => it != payload.id)
                }
            )
    }
})

export const { toggleTaskListId, setTaskListId } = tasksSlice.actions
export default tasksSlice.reducer
