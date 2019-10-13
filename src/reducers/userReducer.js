import { SET_USER } from '../actions/userActions'

const INITIAL_STATE = {
    user: {}
}

export default function (state = INITIAL_STATE, action) {
    const { type, payload } = action
    if (type === SET_USER) {
        return { ...state, user: payload }
    } else {
        return state
    }
}
