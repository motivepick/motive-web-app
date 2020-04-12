export const selectCurrentList = (state) => state.tasks.currentList

export const selectTaskList = (state, list) => state.tasks[list]

export const selectInitialized = (state) => state.tasks.initialized
