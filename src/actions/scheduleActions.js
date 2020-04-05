export const SET_SCHEDULE = 'SET_SCHEDULE'
export const UPDATE_SCHEDULE_TASK_POSITION_INDEX = 'UPDATE_SCHEDULE_TASK_POSITION_INDEX'
export const CLOSE_SCHEDULE_TASK = 'CLOSE_SCHEDULE_TASK'
export const UPDATE_SCHEDULE_TASK = 'UPDATE_SCHEDULE_TASK'

export const setScheduleAction = schedule => ({ type: SET_SCHEDULE, payload: schedule })

export const updateScheduleTaskPositionIndexAction = (sourceDroppableId, sourceIndex, destinationDroppableId, destinationIndex) => ({
    type: UPDATE_SCHEDULE_TASK_POSITION_INDEX,
    payload: { sourceDroppableId, sourceIndex, destinationDroppableId, destinationIndex }
})

export const closeScheduleTaskAction = task => ({ type: CLOSE_SCHEDULE_TASK, payload: task })

export const updateScheduleTaskAction = task => ({ type: UPDATE_SCHEDULE_TASK, payload: task })
