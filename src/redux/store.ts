import { configureStore } from '@reduxjs/toolkit'
import thunkMiddleware from 'redux-thunk'
import { taskApi } from './taskApi'
import { userApi } from './userApi'
import tasksReducer from './reducers/tasksSlice'
import scheduleReducer from './reducers/scheduleSlice'
import taskListsReducer from './reducers/taskListsSlice'
import { REDUX_DEV_TOOLS_ENABLED } from '../config'

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        schedule: scheduleReducer,
        taskLists: taskListsReducer,
        [taskApi.reducerPath]: taskApi.reducer,
        [userApi.reducerPath]: userApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(thunkMiddleware)
            .concat(userApi.middleware)
            .concat(taskApi.middleware),
    devTools: REDUX_DEV_TOOLS_ENABLED
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
