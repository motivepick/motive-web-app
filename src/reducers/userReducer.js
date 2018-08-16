import { CREATE_USER, LOAD_USER, SET_USER, LOGOUT, LOGOUT_CALLBACK } from '../actions/userActions'

export default function(state = {}, action) {
    switch (action.type) {
        case CREATE_USER:
            return { ...state } // TODO: spinner
        case LOAD_USER:
            return { ...state } // TODO: spinner
        case SET_USER:
            return { ...state, user: action.user, done: true }
        case LOGOUT:
            return { ...state } // TODO: spinner
        case LOGOUT_CALLBACK:
            return { ...state, user: undefined }
        default:
            return state
    }
}