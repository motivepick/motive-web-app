import request from 'superagent'
import { API_URL } from '../config'
import {
    ISchedule,
    IScheduleFutureAndOverdue,
    ITask,
    ITaskPositionIndex,
    TaskListTypeAsLiterals
} from '../models/appModel'
import {
    ICreateTaskRequest,
    ISearchScheduleWeekResponse,
    ISearchUserTasksResponse,
    IUpdateTaskRequest
} from '../models/redux/taskServiceModel'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const DO_NOTHING = () => {}

export const searchUserTasks = async (list: TaskListTypeAsLiterals, offset: number, limit: number): Promise<ISearchUserTasksResponse> => {
    const response: request.Response = await request
        .get(`${API_URL}/task-lists/${list}`)
        .query({ offset })
        .query({ limit })
        .withCredentials()
    return response.body as ISearchUserTasksResponse
}

export const updateTasksOrderAsync = (update: ITaskPositionIndex): Promise<void> =>
    request
        .post(`${API_URL}/orders`)
        .send(update)
        .withCredentials()
        .then(DO_NOTHING)

export const createTask = async (task: ICreateTaskRequest): Promise<ITask> => {
    const response = await request.post(`${API_URL}/tasks`).send(task).withCredentials()
    return response.body as ITask
}

export const closeTask = async (id: number): Promise<ITask> => {
    const response = await request.put(`${API_URL}/tasks/${id}/closing`).withCredentials()
    return response.body as ITask
}

export const undoCloseTask = async (id: number): Promise<ITask> => {
    const response = await request.put(`${API_URL}/tasks/${id}/undo-closing`).withCredentials()
    return response.body as ITask
}

export const updateTask = async (taskId: number, task: IUpdateTaskRequest): Promise<ITask> => {
    const response = await request.put(`${API_URL}/tasks/${taskId}`).send(task).withCredentials()
    return response.body as ITask
}

export const searchSchedule = async (): Promise<ISchedule> => {
    const response = await request.get(`${API_URL}/schedule`).withCredentials()
    const serverSchedule = response.body as IScheduleFutureAndOverdue & ISearchScheduleWeekResponse
    return Object.assign({}, { ...serverSchedule.week, future: serverSchedule.future, overdue: serverSchedule.overdue })
}

export default {
    searchUserTasks,
    updateTasksOrderAsync,
    createTask,
    closeTask,
    undoCloseTask,
    updateTask,
    searchSchedule
}
