import { RootState } from '../store'
import { createSelector } from '@reduxjs/toolkit'

export const selectTaskIdToTask = (state: RootState) => state.tasks.byId
export const selectTaskList = (state: RootState, taskListId?: string) => state.tasks.taskLists[taskListId ?? selectTaskListId(state)]
export const selectTaskListTaskIds = (state: RootState, taskListId?: string) => state.tasks.taskLists[taskListId ?? selectTaskListId(state)].allIds
export const selectTaskListId = (state: RootState) => state.tasks.taskListId
export const selectTaskListStatus = (state: RootState) => selectTaskList(state).status
export const selectTaskListLength = (state: RootState) => selectTaskList(state).allIds.length
export const selectTaskListTotalElements = (state: RootState) => selectTaskList(state).totalElements
export const selectTaskListTasks = createSelector(selectTaskListTaskIds, selectTaskIdToTask, ((allIds, byId) => allIds.map(it => byId[it])))
