import { RootState } from '../store'

export const selectTaskListId = (state: RootState) => state.taskLists.taskListId
export const selectTaskListInitialized = (state: RootState) => state.taskLists.taskLists[selectTaskListId(state)].initialized
export const selectTotalElements = (state: RootState) => state.taskLists.taskLists[selectTaskListId(state)].totalElements
export const selectTaskListTasks = (state: RootState) => state.taskLists.taskLists[selectTaskListId(state)].allIds.map(it => state.taskLists.byId[it])
