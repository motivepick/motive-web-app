export const SET_SCHEDULE = 'SET_SCHEDULE'
export const CLOSE_SCHEDULE_TASK = 'CLOSE_SCHEDULE_TASK'
export const UPDATE_SCHEDULE_TASK = 'UPDATE_SCHEDULE_TASK'

export const setScheduleAction = schedule => ({ type: SET_SCHEDULE, payload: schedule })

export const closeScheduleTaskAction = task => ({ type: CLOSE_SCHEDULE_TASK, payload: task })

export const updateScheduleTaskAction = task => ({ type: UPDATE_SCHEDULE_TASK, payload: task })
