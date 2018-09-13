import { combineReducers } from 'redux'

import TaskReducer from './taskReducer'

const rootReducer = combineReducers({
    tasks: TaskReducer
})

export default rootReducer
