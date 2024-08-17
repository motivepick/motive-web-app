import { configureStore } from '@reduxjs/toolkit'
import thunkMiddleware from 'redux-thunk'
import { taskApi } from './taskApi'
import { userApi } from './userApi'
import TaskReducer from './reducers/taskSlice'
import ScheduleReducer from './reducers/scheduleSlice'
import TaskListsReducer from './reducers/taskListSlice'

export const store = configureStore({
    reducer: {
        tasks: TaskReducer,
        schedule: ScheduleReducer,
        taskLists: TaskListsReducer,
        [taskApi.reducerPath]: taskApi.reducer,
        [userApi.reducerPath]: userApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(thunkMiddleware)
            .concat(userApi.middleware)
            .concat(taskApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
