import { DateTime } from 'luxon'
import { string } from 'prop-types'

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
    sourceListType: TaskListIdAsLiterals;
    destinationListType: TaskListIdAsLiterals;
    sourceIndex: number;
    destinationIndex: number;
}

export enum TASK_LIST_ID {
    INBOX = 'INBOX',
    CLOSED = 'CLOSED'
}

export type TaskListIdAsLiterals = `${TASK_LIST_ID}`

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

export type TaskListState = {
    initialized: boolean
    totalElements: number
    allIds: number[]
}

export type TaskListsState = {
    taskListId: string
    taskLists: { [key: string]: TaskListState }
    byId: { [key: number]: ITask }
}

export type TasksState = {
    [key: string]: ITask[]
}