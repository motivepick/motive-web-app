import { DateTime } from 'luxon'

export type ITask = {
    id: number;
    name: string;
    description: string | null;
    dueDate: string | null;
    closed: boolean;
}

export type CreateTaskRequest = {
    name?: string;
    description?: string | null;
    dueDate?: DateTime | null;
}

export type UpdateTaskRequest = {
    id?: number;
    name?: string;
    description?: string | null;
    dueDate?: DateTime | null;
    deleteDueDate?: boolean
    closed?: boolean;
}

export type DueDateExtractionResult = {
    name: string;
    dueDate: DateTime | null;
}

export type ITaskPositionIndex = {
    sourceListType: TaskListTypeAsLiterals;
    destinationListType: TaskListTypeAsLiterals;
    sourceIndex: number;
    destinationIndex: number;
}

export enum TASK_LIST {
    // eslint-disable-next-line no-unused-vars
    INBOX = 'INBOX',
    // eslint-disable-next-line no-unused-vars
    CLOSED = 'CLOSED'
}

export type TaskListTypeAsLiterals = `${TASK_LIST}`

export type IUser = {
    id: number;
    accountId: string;
    name: string;
    temporary: boolean;
}

export type IScheduleFutureAndOverdue = {
    future: ITask[];
    overdue: ITask[];
}

export type IScheduleWeek = {
    [day: string]: ITask[];
}

export type ISchedule = IScheduleFutureAndOverdue & IScheduleWeek;
