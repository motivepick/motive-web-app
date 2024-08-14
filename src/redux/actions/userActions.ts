import { IUser } from '../../models/appModel'
import { UserAction } from '../../models/redux/userActionsModel'
import { handleServerException } from '../../utils/exceptionHandler'
import { AppDispatch } from '../store'
import { userApi } from '../userApi'

export const SET_USER = 'SET_USER'

export const setUserAction = (user: IUser): UserAction => ({ type: SET_USER, payload: user })

export const setUser = () => {
    return async (dispatch: AppDispatch) => {
        try {
            const { data } = await dispatch(userApi.endpoints.fetchUser.initiate())
            if (data) {
                dispatch(setUserAction(data))
            }
        } catch (e) {
            handleServerException(e)
        }
    }
}
