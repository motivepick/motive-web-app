import { combineReducers } from 'redux'

import UserReducer from './userReducer'
import TaskReducer from './taskReducer'

const rootReducer = combineReducers({
    user: UserReducer,
    tasks: TaskReducer
});

export default rootReducer;
