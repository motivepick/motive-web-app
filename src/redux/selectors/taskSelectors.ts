import { TaskListTypeAsLiterals } from '../../models/appModel'
import { AppState, TasksState } from '../../models/redux/stateModel'

export const selectCurrentList = (state: AppState): TaskListTypeAsLiterals => state.tasks.currentList

export const selectTaskLists = (state: AppState): TasksState => state.tasks
