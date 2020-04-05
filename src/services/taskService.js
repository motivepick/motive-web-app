import request from 'superagent'
import { API_URL } from '../config'

export const searchUserTasks = async () => {
    const response = await request.get(`${API_URL}/tasks`).withCredentials()
    return response.body
}

export const createTask = async task => {
    const response = await request.post(`${API_URL}/tasks`).send(task).withCredentials()
    return response.body
}

export const closeTask = async id => {
    const response = await request.put(`${API_URL}/tasks/${id}/closing`).withCredentials()
    return response.body
}

export const undoCloseTask = async id => {
    const response = await request.put(`${API_URL}/tasks/${id}/undo-closing`).withCredentials()
    return response.body
}

export const updateTask = async (taskId, task) => {
    const response = await request.put(`${API_URL}/tasks/${taskId}`).send(task).withCredentials()
    return response.body
}

export const searchSchedule = async () => {
    const response = await request.get(`${API_URL}/schedule`).withCredentials()
    const schedule = response.body
    Object.keys(schedule.week).forEach(day => schedule[day] = schedule.week[day]) // TODO: get rid of week on the server
    delete schedule.week
    return schedule
}
