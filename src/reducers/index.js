import { combineReducers } from 'redux'

import UserReducer from './userReducer'
import TaskReducer from './taskReducer'
import ScheduleReducer from './scheduleReducer'

const rootReducer = combineReducers({
    user: UserReducer,
    tasks: TaskReducer,
    schedule: ScheduleReducer
})

export default rootReducer
