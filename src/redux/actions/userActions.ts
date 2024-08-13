import { IUser } from '../../models/appModel'
import { UserAction } from '../../models/redux/userActionsModel'
import api from '../../services/userService'
import { handleServerException } from '../../utils/exceptionHandler'

export const SET_USER = 'SET_USER'

export const setUserAction = (user: IUser): UserAction => ({ type: SET_USER, payload: user })

export const setUser = () => {
    // @ts-ignore
    return async (dispatch) => {
        try {
            dispatch(setUserAction(await api.fetchUser()))
        } catch (e) {
            handleServerException(e)
        }
    }
}
