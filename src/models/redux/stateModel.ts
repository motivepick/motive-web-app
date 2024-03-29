import { ISchedule, ITask, IUser, TaskListTypeAsLiterals } from '../appModel'

export type UserState = {
    user: IUser
}

export type ScheduleState = {
    schedule: ISchedule;
    initialized: boolean;
}

export type TaskListWithTotal = {
    content: ITask[];
    totalElements: number;
}

type TaskListState = {
    'INBOX': TaskListWithTotal,
    'CLOSED': TaskListWithTotal,
}

type TaskState = {
    task: ITask;
    currentList: TaskListTypeAsLiterals;
    initialized: boolean;
}

export type TasksState = TaskState & TaskListState

export type AppState = {
    user: UserState;
    tasks: TasksState;
    schedule: ScheduleState;
}
