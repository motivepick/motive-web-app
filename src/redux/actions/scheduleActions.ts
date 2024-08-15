import { ISchedule, ITask } from '../../models/appModel'
import { IScheduleTaskPositionIndex, ScheduleAction, ScheduleTaskAction, ScheduleTaskPositionIndexAction } from '../../models/redux/scheduleActionModel'
import api from '../../services/taskService'
import { handleServerException } from '../../utils/exceptionHandler'
import { delay, DELAY_MS } from '../../utils/delay'
import { taskApi } from '../taskApi'
import { closeTaskAction, updateTaskAction } from './taskActions'

export const SET_SCHEDULE = 'SET_SCHEDULE'
export const UPDATE_SCHEDULE_TASK_POSITION_INDEX = 'UPDATE_SCHEDULE_TASK_POSITION_INDEX'
export const CLOSE_SCHEDULE_TASK = 'CLOSE_SCHEDULE_TASK'
export const UPDATE_SCHEDULE_TASK = 'UPDATE_SCHEDULE_TASK'

export const setScheduleAction = (schedule: ISchedule): ScheduleAction => ({ type: SET_SCHEDULE, payload: schedule })

export const updateScheduleTaskPositionIndexAction =
    (scheduleTaskPositionIndex: IScheduleTaskPositionIndex): ScheduleTaskPositionIndexAction =>
        ({
            type: UPDATE_SCHEDULE_TASK_POSITION_INDEX,
            payload: scheduleTaskPositionIndex
        })

export const closeScheduleTaskAction = (task: ITask): ScheduleTaskAction => ({
    type: CLOSE_SCHEDULE_TASK,
    payload: task
})

export const updateScheduleTaskAction = (task: ITask): ScheduleTaskAction => ({
    type: UPDATE_SCHEDULE_TASK,
    payload: task
})

export const setSchedule = () => {
    // @ts-ignore
    return async (dispatch) => {
        try {
            // @ts-ignore
            dispatch(setScheduleAction(taskApi.endpoints.searchSchedule.initiate()))
        } catch (e) {
            handleServerException(e)
        }
    }
}

export const closeScheduleTask = (id: number) => {
    // @ts-ignore
    return async (dispatch) => {
        try {
            const values = await Promise.all([api.closeTask(id), delay(DELAY_MS)])
            const closedTask = values[0]
            dispatch(closeScheduleTaskAction(closedTask))
            dispatch(closeTaskAction(closedTask))
        } catch (e) {
            handleServerException(e)
        }
    }
}

export const updateScheduleTask = (id: number, task: ITask) => {
    // @ts-ignore
    return async (dispatch) => {
        try {
            const updatedTask = await api.updateTask(id, task)
            // dispatch(updateScheduleTaskAction(updatedTask))
            dispatch(updateTaskAction(updatedTask))
        } catch (e) {
            handleServerException(e)
        }
    }
}
