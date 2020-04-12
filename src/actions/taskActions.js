export const SET_TASKS = 'SET_TASKS'
export const UPDATE_TASK_POSITION_INDEX = 'UPDATE_TASK_POSITION_INDEX'
export const CREATE_TASK = 'CREATE_TASK'
export const CLOSE_TASK = 'CLOSE_TASK'
export const UNDO_CLOSE_TASK = 'UNDO_CLOSE_TASK'
export const SET_CURRENT_LIST = 'SET_CURRENT_LIST'
export const UPDATE_TASK = 'UPDATE_TASK'

export const setTasksAction = (list, tasks) => ({ type: SET_TASKS, payload: { list, tasks } })

export const updateTaskPositionIndexAction = (sourceListType, sourceIndex, destinationListType, destinationIndex) => ({
    type: UPDATE_TASK_POSITION_INDEX,
    payload: { sourceListType, sourceIndex, destinationListType, destinationIndex }
})

export const createTaskAction = task => ({ type: CREATE_TASK, payload: task })

export const closeTaskAction = task => ({ type: CLOSE_TASK, payload: task })

export const undoCloseTaskAction = task => ({ type: UNDO_CLOSE_TASK, payload: task })

export const setCurrentListAction = currentList => ({ type: SET_CURRENT_LIST, payload: currentList })

export const updateTaskAction = task => ({ type: UPDATE_TASK, payload: task })
