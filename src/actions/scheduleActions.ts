import { ISchedule, ITask } from '../models'

export const SET_SCHEDULE = 'SET_SCHEDULE'
export const UPDATE_SCHEDULE_TASK_POSITION_INDEX = 'UPDATE_SCHEDULE_TASK_POSITION_INDEX'
export const CLOSE_SCHEDULE_TASK = 'CLOSE_SCHEDULE_TASK'
export const UPDATE_SCHEDULE_TASK = 'UPDATE_SCHEDULE_TASK'


type IScheduleTaskPositionIndex = {
    sourceDroppableId: string;
    destinationDroppableId: string;
    sourceIndex: number;
    destinationIndex: number;
}

type ScheduleAction = { type: string; payload: ISchedule; }
type ScheduleTaskAction = { type: string; payload: ITask; }
type ScheduleTaskPositionIndexAction = { type: string; payload: IScheduleTaskPositionIndex; }

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
