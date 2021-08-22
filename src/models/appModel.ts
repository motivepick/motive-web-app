import { Moment } from 'moment'

export type ITask = {
    id: number;
    name: string;
    description: string | null;
    created: Moment | string;
    dueDate: Moment | string | null;
    closingDate: Moment | string | null;
    closed: boolean;
    visible: boolean;
}

export type ITaskNullable = {
    id?: number;
    name?: string;
    description?: string | null;
    created?: Moment | string;
    dueDate?: Moment | string | null;
    closingDate?: Moment | string | null;
    closed?: boolean;
    visible?: boolean;
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
