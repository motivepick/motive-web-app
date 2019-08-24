export const SET_TASK = 'SET_TASK'
export const CHANGE_TASK_DESCRIPTION = 'CHANGE_TASK_DESCRIPTION'
export const UPDATE_USER_TASKS = 'UPDATE_USER_TASKS'
export const CREATE_TASK = 'CREATE_TASK'
export const CLOSE_TASK = 'CLOSE_TASK'
export const UNDO_CLOSE_TASK = 'UNDO_CLOSE_TASK'
export const TOGGLE_OPEN_CLOSED_TASKS = 'TOGGLE_OPEN_CLOSED_TASKS'
export const UPDATE_TASK = 'UPDATE_TASK'
export const DELETE_TASK = 'DELETE_TASK'
export const RESET = 'RESET'

export const setTaskAction = task => ({ type: SET_TASK, payload: task })

export const changeTaskDescriptionAction = description => ({ type: CHANGE_TASK_DESCRIPTION, payload: description })

export const updateUserTasksAction = tasks => ({ type: UPDATE_USER_TASKS, payload: tasks })

export const createTaskAction = task => ({ type: CREATE_TASK, payload: task })

export const closeTaskAction = task => ({ type: CLOSE_TASK, payload: task })

export const undoCloseTaskAction = task => ({ type: UNDO_CLOSE_TASK, payload: task })

export const toggleOpenClosedTasksAction = closed => ({ type: TOGGLE_OPEN_CLOSED_TASKS, payload: closed })

export const updateTaskAction = task => ({ type: UPDATE_TASK, payload: task })

export const deleteTaskAction = id => ({ type: DELETE_TASK, payload: id })

export const resetAction = () => ({ type: RESET })