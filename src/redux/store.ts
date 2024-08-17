import { configureStore } from '@reduxjs/toolkit'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'
import { taskApi } from './taskApi'
import { userApi } from './userApi'

export const store = configureStore({
    reducer: rootReducer,
    // @ts-ignore
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(thunkMiddleware)
            .concat(userApi.middleware)
            .concat(taskApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch