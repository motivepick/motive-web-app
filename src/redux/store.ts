import { configureStore } from '@reduxjs/toolkit'
import { api } from './api'
import tasksReducer from './reducers/tasksSlice'
import scheduleReducer from './reducers/scheduleSlice'
import taskListsReducer from './reducers/taskListsSlice'
import { REDUX_DEV_TOOLS_ENABLED } from '../config'

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        schedule: scheduleReducer,
        taskLists: taskListsReducer,
        [api.reducerPath]: api.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware),
    devTools: REDUX_DEV_TOOLS_ENABLED
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
