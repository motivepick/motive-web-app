import { combineReducers } from 'redux'
import { taskApi } from '../taskApi'
import { userApi } from '../userApi'

import TaskReducer from './taskSlice'
import TaskListsReducer from './taskListSlice'
import ScheduleReducer from './scheduleSlice'

const rootReducer = combineReducers({
    tasks: TaskReducer,
    schedule: ScheduleReducer,
    taskLists: TaskListsReducer,
    [taskApi.reducerPath]: taskApi.reducer,
    [userApi.reducerPath]: userApi.reducer
})

export default rootReducer
