import { ISchedule, ITask, IUser, TaskListTypeAsLiterals } from '../models'

type UserState = {
    user?: IUser
}

type ScheduleState = {
    schedule: ISchedule;
    initialized: boolean;
}


export type TaskListWithTotal = {
    content: ITask[];
    totalElements: number;
}

type TaskListState = {
    [list: string]: TaskListWithTotal
}

type TaskState = {
    task: ITask;
    currentList: TaskListTypeAsLiterals;
    initialized: boolean;
}

type TasksState = TaskState & TaskListState

export type AppState = {
    user: UserState;
    tasks: TasksState;
    schedule: ScheduleState;
}
