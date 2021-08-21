import { IUser } from '../models'
import { AppState } from './state.model'

export const selectUser = (state: AppState): IUser => state?.user?.user as IUser
