import { ISchedule, ITask } from '../appModel'
import { Action } from './actionModel'


export type IScheduleTaskPositionIndex = {
    sourceDroppableId: string;
    destinationDroppableId: string;
    sourceIndex: number;
    destinationIndex: number;
}

export type ScheduleAction = Action<ISchedule>
export type ScheduleTaskAction = Action<ITask>
export type ScheduleTaskPositionIndexAction = Action<IScheduleTaskPositionIndex>
