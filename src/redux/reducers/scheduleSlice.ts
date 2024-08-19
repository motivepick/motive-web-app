import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ISchedule } from '../../models/appModel'
import { IScheduleTaskPositionIndex } from '../../models/redux/scheduleActionModel'
import { api } from '../api'

const INITIAL_STATE: ISchedule = { overdue: [], future: [] }

const scheduleSlice = createSlice({
    name: 'schedule',
    initialState: INITIAL_STATE,
    reducers: {
        updateScheduleTaskPositionIndex(state, action: PayloadAction<IScheduleTaskPositionIndex>) {
            const { sourceDroppableId, sourceIndex, destinationDroppableId, destinationIndex } = action.payload
            const task = state[sourceDroppableId][sourceIndex]
            state[sourceDroppableId].splice(sourceIndex, 1)
            state[destinationDroppableId].splice(destinationIndex, 0, task)
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                api.endpoints.updateTask.matchFulfilled,
                (state, { payload }) => {
                    Object.keys(state).forEach(day => {
                        state[day] = state[day].map(task => task.id === payload.id ? payload : task)
                    })
                }
            )
            .addMatcher(
                api.endpoints.closeTask.matchFulfilled,
                (state, { payload }) => {
                    Object.keys(state).forEach(day => {
                        state[day] = state[day].filter(task => task.id !== payload.id)
                    })
                }
            )
            .addMatcher(
                api.endpoints.fetchSchedule.matchFulfilled,
                (state, { payload }) => {
                    Object.assign(state, payload)
                }
            )
    }
})

export const { updateScheduleTaskPositionIndex } = scheduleSlice.actions
export default scheduleSlice.reducer
