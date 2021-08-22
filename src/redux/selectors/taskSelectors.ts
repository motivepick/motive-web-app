import { TaskListTypeAsLiterals } from '../../models/appModel'
import { AppState, TaskListWithTotal } from '../../models/redux/stateModel'

export const selectCurrentList = (state: AppState): TaskListTypeAsLiterals => state.tasks.currentList

export const selectTaskList = (state: AppState, list: TaskListTypeAsLiterals): TaskListWithTotal => state.tasks[list]

export const selectInitialized = (state: AppState): boolean => state.tasks.initialized
