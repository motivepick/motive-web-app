import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ITask } from '../../models/appModel'
import { taskApi } from '../taskApi'

const INITIAL_STATE: ITask[] = []

const taskSlice = createSlice({
    name: 'tasks',
    initialState: INITIAL_STATE,
    reducers: {
        updateTask(state, action: PayloadAction<ITask>) {
            const updatedTask = action.payload
            return state.map(task => task.id === updatedTask.id ? updatedTask : task)
        },
        addTask(state, action: PayloadAction<ITask>) {
            state.push(action.payload)
        },
        removeTask(state, action: PayloadAction<number>) {
            return state.filter(task => task.id !== action.payload)
        }
    },
    extraReducers: (builder) => {
        // builder.addMatcher(
        //     taskApi.endpoints.searchUserTasks.matchFulfilled,
        //     (state, { payload }) => {
        //         return payload
        //     }
        // )
        builder.addMatcher(
            taskApi.endpoints.createTask.matchFulfilled,
            (state, { payload }) => {
                state.push(payload)
            }
        )
        builder.addMatcher(
            taskApi.endpoints.updateTask.matchFulfilled,
            (state, { payload }) => {
                return state.map(task => task.id === payload.id ? payload : task)
            }
        )
        builder.addMatcher(
            taskApi.endpoints.closeTask.matchFulfilled,
            (state, { payload }) => {
                return state.filter(task => task.id !== payload.id)
            }
        )
        builder.addMatcher(
            taskApi.endpoints.undoCloseTask.matchFulfilled,
            (state, { payload }) => {
                state.push(payload)
            }
        )
    }
})

export const { updateTask, addTask, removeTask } = taskSlice.actions
export default taskSlice.reducer