import { CLOSE_SCHEDULE_TASK, SET_SCHEDULE, UPDATE_SCHEDULE_TASK } from '../actions/scheduleActions'

const INITIAL_STATE = {
    schedule: { week: {}, overdue: [], future: [] },
    initialized: false
}

const closeInList = (tasks, id) => tasks.filter(t => t.id !== id)

const closeInWeek = (week, id) => {
    const result = {}
    Object.keys(week).forEach(day => {
        const tasks = week[day]
        result[day] = closeInList(tasks, id)
    })
    return result
}

const updateInList = (tasks, payload) => {
    const result = []
    for (const task of tasks) {
        result.push(task.id === payload.id ? { ...task, ...payload } : task)
    }
    return result
}

const updateInWeek = (week, payload) => {
    const result = {}
    Object.keys(week).forEach(day => {
        const tasks = week[day]
        result[day] = updateInList(tasks, payload)
    })
    return result
}

export default function (state = INITIAL_STATE, action) {
    const { type, payload } = action
    if (type === SET_SCHEDULE) {
        return { ...state, schedule: payload, initialized: true }
    } else if (type === CLOSE_SCHEDULE_TASK) {
        const { id } = payload
        return {
            ...state,
            schedule: {
                ...state.schedule,
                week: closeInWeek(state.schedule.week, id),
                overdue: closeInList(state.schedule.overdue, id),
                future: closeInList(state.schedule.future, id)
            }
        }
    } else if (type === UPDATE_SCHEDULE_TASK) {
        return {
            ...state,
            schedule: {
                ...state.schedule,
                week: updateInWeek(state.schedule.week, payload),
                overdue: updateInList(state.schedule.overdue, payload),
                future: updateInList(state.schedule.future, payload)
            }
        }
    } else {
        return state
    }
}
