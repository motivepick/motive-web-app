import request from 'superagent'
import { API_URL } from '../const'

export const SEARCH_USER_TASKS = 'SEARCH_USER_TASKS'
export const UPDATE_USER_TASKS = 'UPDATE_USER_TASKS'
export const SHOW_ERROR = 'SHOW_ERROR'
export const CREATE_TASK = 'CREATE_TASK'
export const UPDATE_TASK = 'UPDATE_TASK'

export const searchUserTasks = (accountId) => {
    const req = request.get(`${API_URL}/tasks/list/${accountId}`)

    return {
        type: SEARCH_USER_TASKS,
        payload: req
    }
}

export const updateUserTasks = (tasks) => {
    return {
        type: UPDATE_USER_TASKS,
        tasks: tasks
    }
}

export const showError = (error) => {
    return {
        type: SHOW_ERROR,
        error
    }
}

export const createTask = (task) => {
    const req = request.post(`${API_URL}/tasks`).send(task);

    return {
        type: CREATE_TASK,
        payload: req
    }
}

export const updateTask = (taskId, task) => {
    const req = request.put(`${API_URL}/tasks/${taskId}`).send(task);

    return {
        type: UPDATE_TASK,
        payload: req
    }
}