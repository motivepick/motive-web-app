import { combineReducers } from 'redux'
import { userApi } from '../userApi'

import TaskReducer from './taskReducer'
import ScheduleReducer from './scheduleReducer'

const rootReducer = combineReducers({
    tasks: TaskReducer,
    schedule: ScheduleReducer,
    [userApi.reducerPath]: userApi.reducer
})

export default rootReducer
