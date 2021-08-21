import { SET_USER, UserAction } from '../actions/userActions'
import { IUser } from '../models'
import { UserState } from '../selectors/state.model'

const INITIAL_STATE = {
    user: <IUser>{}
}

export default function (state: UserState = INITIAL_STATE, action: UserAction) {
    const { type, payload } = action
    if (type === SET_USER) {
        return { ...state, user: payload }
    } else {
        return state
    }
}
