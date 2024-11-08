import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { FetchTaskListQueryParams, ISearchUserTasksResponse, TASK_LIST_ID, TaskListsState } from '../../models/appModel'
import { api } from '../api'
import { AppDispatch, RootState } from '../store'
import fetchClient from '../../fetchClient'
import { selectTaskList } from '../selectors/selectors'

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
                const { sourceListType, sourceIndex, destinationListType, destinationIndex } = meta.arg.originalArgs
                const id = state.taskLists[sourceListType].allIds.splice(sourceIndex, 1)[0]
                state.taskLists[destinationListType].allIds.splice(destinationIndex, 0, id)
            })
    }
})

export const { toggleTaskListId, setTaskListId, resetTaskLists } = tasksSlice.actions
export default tasksSlice.reducer
