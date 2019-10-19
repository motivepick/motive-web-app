import { UPDATE_SCHEDULE } from '../actions/scheduleActions'

const INITIAL_STATE = {
    schedule: { week: {}, overdue: [], future: [] }
}

export default function (state = INITIAL_STATE, action) {
    const { type, payload } = action
    if (type === UPDATE_SCHEDULE) {
        return { ...state, schedule: payload }
    } else {
        return state
    }
}
