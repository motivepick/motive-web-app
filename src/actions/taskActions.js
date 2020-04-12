export const SET_TASKS = 'SET_TASKS'
export const UPDATE_TASK_POSITION_INDEX = 'UPDATE_TASK_POSITION_INDEX'
export const CREATE_TASK = 'CREATE_TASK'
export const CLOSE_TASK = 'CLOSE_TASK'
export const UNDO_CLOSE_TASK = 'UNDO_CLOSE_TASK'
export const TOGGLE_OPEN_CLOSED_TASKS = 'TOGGLE_OPEN_CLOSED_TASKS'
export const UPDATE_TASK = 'UPDATE_TASK'

export const setTasksAction = tasks => ({ type: SET_TASKS, payload: tasks })

export const updateTaskPositionIndexAction = (sourceIndex, destinationIndex) => ({
    type: UPDATE_TASK_POSITION_INDEX,
    payload: { sourceIndex, destinationIndex }
})

export const createTaskAction = task => ({ type: CREATE_TASK, payload: task })

export const closeTaskAction = task => ({ type: CLOSE_TASK, payload: task })

export const undoCloseTaskAction = task => ({ type: UNDO_CLOSE_TASK, payload: task })

export const toggleOpenClosedTasksAction = closed => ({ type: TOGGLE_OPEN_CLOSED_TASKS, payload: closed })

export const updateTaskAction = task => ({ type: UPDATE_TASK, payload: task })
