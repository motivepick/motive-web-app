import { RootState } from '../store'

export const selectTaskListId = (state: RootState) => state.tasks.taskListId
export const selectTaskListInitialized = (state: RootState) => state.tasks.taskLists[selectTaskListId(state)].initialized
export const selectTaskListLength = (state: RootState) => state.tasks.taskLists[selectTaskListId(state)].allIds.length
export const selectTotalElements = (state: RootState) => state.tasks.taskLists[selectTaskListId(state)].totalElements
export const selectTaskListTasks = (state: RootState) => state.tasks.taskLists[selectTaskListId(state)].allIds.map(it => state.tasks.byId[it])
