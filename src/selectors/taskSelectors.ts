import { TaskListTypeAsLiterals } from '../models'
import { AppState, TaskListWithTotal } from './state.model'

export const selectCurrentList = (state: AppState): TaskListTypeAsLiterals => state.tasks.currentList

export const selectTaskList = (state: AppState, list: TaskListTypeAsLiterals): TaskListWithTotal => state.tasks[list]

export const selectInitialized = (state: AppState): boolean => state.tasks.initialized
