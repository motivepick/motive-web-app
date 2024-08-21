import { RootState } from '../store'

const selectTaskList = (state: RootState) => state.tasks.taskLists[selectTaskListId(state)]

export const selectTaskListId = (state: RootState) => state.tasks.taskListId
export const selectTaskListStatus = (state: RootState) => selectTaskList(state).status
export const selectTaskListLength = (state: RootState) => selectTaskList(state).allIds.length
export const selectTaskListTotalElements = (state: RootState) => selectTaskList(state).totalElements
export const selectTaskListTasks = (state: RootState) => selectTaskList(state).allIds.map(it => state.tasks.byId[it])
