import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ISchedule, ITask } from '../../models/appModel'
import { IScheduleTaskPositionIndex } from '../../models/redux/scheduleActionModel'
import { updateTaskAction } from '../actions/taskActions'
import { taskApi } from '../taskApi'
import { updateTask } from './taskSlice'

const INITIAL_STATE: ISchedule = { overdue: [], future: [] }

const scheduleSlice = createSlice({
    name: 'schedule',
    initialState: INITIAL_STATE,
    reducers: {
        setSchedule(state, action: PayloadAction<ISchedule>) {
            return action.payload
        },
        updateScheduleTaskPositionIndex(state, action: PayloadAction<IScheduleTaskPositionIndex>) {
            const { sourceDroppableId, sourceIndex, destinationDroppableId, destinationIndex } = action.payload
            const task = state[sourceDroppableId][sourceIndex]
            state[sourceDroppableId].splice(sourceIndex, 1)
            state[destinationDroppableId].splice(destinationIndex, 0, task)
        },
        closeScheduleTask(state, action: PayloadAction<number>) {
            const id = action.payload
            Object.keys(state).forEach(day => {
                state[day] = state[day].filter(task => task.id !== id)
            })
        },
        updateScheduleTask(state, action: PayloadAction<ITask>) {
            const updatedTask = action.payload
            Object.keys(state).forEach(day => {
                state[day] = state[day].map(task => task.id === updatedTask.id ? updatedTask : task)
            })
        }
    },
    extraReducers: (builder) => {
        builder.addCase(updateTask, (state, action: PayloadAction<ITask>) => {
            const updatedTask = action.payload
            Object.keys(state).forEach(day => {
                state[day] = state[day].map(task => task.id === updatedTask.id ? updatedTask : task)
            })
        }),
        builder.addMatcher(
            taskApi.endpoints.searchSchedule.matchFulfilled,
            (state, { payload }) => {
                return payload
            }
        )
    }
})

export const { setSchedule, updateScheduleTaskPositionIndex, closeScheduleTask, updateScheduleTask  } = scheduleSlice.actions
export default scheduleSlice.reducer