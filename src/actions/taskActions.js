import request from 'superagent'
import { API_URL } from '../const'

export const SEARCH_USER_TASKS = 'SEARCH_USER_TASKS'
export const UPDATE_USER_TASKS = 'UPDATE_USER_TASKS'
export const SHOW_ERROR = 'SHOW_ERROR'
export const CREATE_TASK = 'CREATE_TASK'
export const UPDATE_TASK = 'UPDATE_TASK'

export const searchUserTasks = () => {
    const req = request.get(`${API_URL}/tasks`).withCredentials()

    return {
        type: SEARCH_USER_TASKS,
        payload: req
    }
}

export const updateUserTasks = query => ({
    type: UPDATE_USER_TASKS,
    query: query
})

export const showError = error => ({
    type: SHOW_ERROR,
    error
})

export const createTask = task => {
    const req = request.post(`${API_URL}/tasks`).send(task).withCredentials()

    return {
        type: CREATE_TASK,
        payload: req
    }
}

export const updateTask = (taskId, task) => {
    const req = request.put(`${API_URL}/tasks/${taskId}`).send(task).withCredentials()

    return {
        type: UPDATE_TASK,
        payload: req
    }
}
