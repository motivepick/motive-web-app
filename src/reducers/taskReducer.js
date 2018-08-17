import { SHOW_ERROR, SEARCH_USER_TASKS, UPDATE_USER_TASKS, CREATE_TASK, UPDATE_TASK } from '../actions/taskActions'

const INITIAL_STATE = {
    tasks: [],
    error: null
}
export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case SEARCH_USER_TASKS:
        case CREATE_TASK:
        case UPDATE_TASK:
            return { ...state } // TODO: spinner
        case UPDATE_USER_TASKS:
            return { ...state, tasks: action.tasks }
        case SHOW_ERROR:
            return { ...state, error: action.error }
        default:
            return state
    }
}