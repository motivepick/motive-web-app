import { IUser } from '../models/appModel'
import { UserAction } from '../models/redux/userActionsModel'

export const SET_USER = 'SET_USER'

export const setUserAction = (user: IUser): UserAction => ({ type: SET_USER, payload: user })
