import { SET_SCHEDULE } from '../actions/scheduleActions'

const INITIAL_STATE = {
    schedule: { week: {}, overdue: [], future: [] },
    initialized: false
}

export default function (state = INITIAL_STATE, action) {
    const { type, payload } = action
    if (type === SET_SCHEDULE) {
        return { ...state, schedule: payload, initialized: true }
    } else {
        return state
    }
}
