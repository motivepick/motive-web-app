import { SET_USER } from '../actions/userActions'
import { IUser } from '../../models/appModel'
import { UserState } from '../../models/redux/stateModel'
import { UserAction } from '../../models/redux/userActionsModel'

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
