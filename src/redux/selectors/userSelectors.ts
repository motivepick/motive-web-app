import { IUser } from '../../models/appModel'
import { AppState } from '../../models/redux/stateModel'

export const selectUser = (state: AppState): IUser => state?.user?.user as IUser
