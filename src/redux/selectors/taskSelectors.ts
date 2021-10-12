import { TaskListTypeAsLiterals } from '../../models/appModel'
import { AppState, TaskListWithTotal, TasksState } from '../../models/redux/stateModel'
import { createSelector } from 'reselect'

export const selectCurrentList = (state: AppState): TaskListTypeAsLiterals => state.tasks.currentList

export const selectTaskList = (state: AppState, list: TaskListTypeAsLiterals): TaskListWithTotal => state.tasks[list]

export const selectInitialized = (state: AppState): boolean => state.tasks.initialized

const selectAllTasks = (state: AppState): TasksState => state.tasks

export const selectDisplayedTasks = createSelector(
    selectAllTasks,
    selectCurrentList,
    (tasks, currentList) => tasks[currentList]
)
