import { LOGOUT } from '../actions/userActions'

export default function(state = {}, action) {
    switch (action.type) {
        case LOGOUT:
            return { ...state } // TODO: spinner
        default:
            return state
    }
}