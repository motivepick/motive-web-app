import {
    IScheduleTaskPositionIndex,
    ScheduleAction,
    ScheduleTaskAction,
    ScheduleTaskPositionIndexAction
} from '../models/redux/scheduleActionModel'
import {
    CLOSE_SCHEDULE_TASK,
    SET_SCHEDULE,
    UPDATE_SCHEDULE_TASK,
    UPDATE_SCHEDULE_TASK_POSITION_INDEX
} from '../actions/scheduleActions'
import { ISchedule, ITask } from '../models/appModel'
import { ScheduleState } from '../models/redux/stateModel'
import { copyOfListWithUpdatedTask } from '../utils/lists'

const INITIAL_STATE = {
    schedule: <ISchedule>{ overdue: [], future: [] },
    initialized: false
}
const copyOfListWithoutTask = (tasks: ITask[], id: number): ITask[] => tasks.filter(t => t.id !== id)

const copyOfScheduleWithoutTask = (schedule: ISchedule, id: number): ISchedule => {
    const result: ISchedule = { overdue: [], future: [] }
    Object.keys(schedule).forEach(day => {
        const tasks = schedule[day]
        result[day] = copyOfListWithoutTask(tasks, id)
    })
    return result
}

const copyOfScheduleWithUpdatedTask = (schedule: ISchedule, payload: ITask): ISchedule => {
    const result: ISchedule = { overdue: [], future: [] }
    Object.keys(schedule).forEach(day => {
        const tasks = schedule[day]
        result[day] = copyOfListWithUpdatedTask(tasks, payload)
    })
    return result
}

export default function (state: ScheduleState = INITIAL_STATE, action: ScheduleAction | ScheduleTaskAction | ScheduleTaskPositionIndexAction) {
    const { type, payload } = action
    if (type === SET_SCHEDULE) {
        return { ...state, schedule: payload, initialized: true }
    } else if (type === UPDATE_SCHEDULE_TASK_POSITION_INDEX) {
        const {
            sourceDroppableId,
            sourceIndex,
            destinationDroppableId,
            destinationIndex
        } = payload as IScheduleTaskPositionIndex
        const updatedSourceList = state.schedule[sourceDroppableId]
        const updatedDestinationList = state.schedule[destinationDroppableId]
        const task = updatedSourceList[sourceIndex]
        updatedSourceList.splice(sourceIndex, 1)
        updatedDestinationList.splice(destinationIndex, 0, task)
        return { ...state, [sourceDroppableId]: updatedSourceList, [destinationDroppableId]: updatedDestinationList }
    } else if (type === CLOSE_SCHEDULE_TASK) {
        const { id } = payload as ITask
        return {
            ...state,
            schedule: copyOfScheduleWithoutTask(state.schedule, id)
        }
    } else if (type === UPDATE_SCHEDULE_TASK) {
        return {
            ...state,
            schedule: copyOfScheduleWithUpdatedTask(state.schedule, payload as ITask)
        }
    } else {
        return state
    }
}
