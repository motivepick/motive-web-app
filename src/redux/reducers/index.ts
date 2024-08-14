import { combineReducers } from 'redux'
import { userApi } from '../userApi'

import UserReducer from './userReducer'
import TaskReducer from './taskReducer'
import ScheduleReducer from './scheduleReducer'

const rootReducer = combineReducers({
    user: UserReducer,
    tasks: TaskReducer,
    schedule: ScheduleReducer,
    [userApi.reducerPath]: userApi.reducer
})

export default rootReducer
