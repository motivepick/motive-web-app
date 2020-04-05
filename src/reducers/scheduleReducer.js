import { CLOSE_SCHEDULE_TASK, SET_SCHEDULE, UPDATE_SCHEDULE_TASK, UPDATE_SCHEDULE_TASK_POSITION_INDEX } from '../actions/scheduleActions'

const INITIAL_STATE = {
    schedule: { overdue: [], future: [] },
    initialized: false
}

const copyOfListWithoutTask = (tasks, id) => tasks.filter(t => t.id !== id)

const copyOfScheduleWithoutTask = (schedule, id) => {
    const result = {}
    Object.keys(schedule).forEach(day => {
        const tasks = schedule[day]
        result[day] = copyOfListWithoutTask(tasks, id)
    })
    return result
}

const copyOfListWithUpdatedTask = (tasks, payload) => {
    const result = []
    for (const task of tasks) {
        result.push(task.id === payload.id ? { ...task, ...payload } : task)
    }
    return result
}

const copyOfScheduleWithUpdatedTask = (schedule, payload) => {
    const result = {}
    Object.keys(schedule).forEach(day => {
        const tasks = schedule[day]
        result[day] = copyOfListWithUpdatedTask(tasks, payload)
    })
    return result
}

export default function (state = INITIAL_STATE, action) {
    const { type, payload } = action
    if (type === SET_SCHEDULE) {
        return { ...state, schedule: payload, initialized: true }
    } else if (type === UPDATE_SCHEDULE_TASK_POSITION_INDEX) {
        const { sourceDroppableId, sourceIndex, destinationDroppableId, destinationIndex } = payload
        const updatedSourceList = state.schedule[sourceDroppableId]
        const updatedDestinationList = state.schedule[destinationDroppableId]
        const task = updatedSourceList[sourceIndex]
        updatedSourceList.splice(sourceIndex, 1)
        updatedDestinationList.splice(destinationIndex, 0, task)
        return { ...state, [sourceDroppableId]: updatedSourceList, [destinationDroppableId]: updatedDestinationList }
    } else if (type === CLOSE_SCHEDULE_TASK) {
        const { id } = payload
        return {
            ...state,
            schedule: copyOfScheduleWithoutTask(state.schedule, id)
        }
    } else if (type === UPDATE_SCHEDULE_TASK) {
        return {
            ...state,
            schedule: copyOfScheduleWithUpdatedTask(state.schedule, payload)
        }
    } else {
        return state
    }
}
