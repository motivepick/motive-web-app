import { IUser } from '../models'

export const SET_USER = 'SET_USER'

type UserAction = {
    type: string
    payload: IUser
}

export const setUserAction = (user: IUser): UserAction => ({ type: SET_USER, payload: user })
