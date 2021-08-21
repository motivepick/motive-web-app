import { IUser } from '../models'
import { Action } from './action.model'

export const SET_USER = 'SET_USER'

export type UserAction = Action<IUser>

export const setUserAction = (user: IUser): UserAction => ({ type: SET_USER, payload: user })
