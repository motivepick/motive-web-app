import { configureStore } from '@reduxjs/toolkit'
import { api } from './api'
import scheduleReducer from './reducers/scheduleSlice'
import tasksReducer from './reducers/tasksSlice'
import { REDUX_DEV_TOOLS_ENABLED } from '../config'

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        schedule: scheduleReducer,
        [api.reducerPath]: api.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware),
    devTools: REDUX_DEV_TOOLS_ENABLED
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
