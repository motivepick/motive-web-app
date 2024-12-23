import { DateTime } from 'luxon'

export type IPage = {
    size: number
    number: number
    totalElements: number
    totalPages: number
}

export type ISearchUserTasksResponse = {
    content: ITask[]
    page: IPage
}

export type RescheduleTaskRequest = {
    dueDate: DateTime | null
    taskIds: number[]
}

export type ITask = {
    id: number
    name: string
    description: string | null
    dueDate: string | null
    closed: boolean
}

export type CreateTaskRequest = {
    name?: string
    description?: string | null
    dueDate?: DateTime | null
}

export type UpdateTaskRequest = {
    id?: number
    name?: string
    description?: string | null
    dueDate?: DateTime | null
    deleteDueDate?: boolean
    closed?: boolean
}

export type DueDateExtractionResult = {
    name: string
    dueDate: DateTime | null
}

export type TaskPositionChange = {
    sourceListId: string
    taskId: number
    destinationListId: string
    destinationIndex: number
}

export enum TASK_LIST_ID {
    INBOX = 'INBOX',
    CLOSED = 'CLOSED',
    SCHEDULE_0 = 'SCHEDULE_0',
    SCHEDULE_1 = 'SCHEDULE_1',
    SCHEDULE_2 = 'SCHEDULE_2',
    SCHEDULE_3 = 'SCHEDULE_3',
    SCHEDULE_4 = 'SCHEDULE_4',
    SCHEDULE_5 = 'SCHEDULE_5',
    SCHEDULE_6 = 'SCHEDULE_6',
    SCHEDULE_OVERDUE = 'SCHEDULE_OVERDUE',
    SCHEDULE_FUTURE = 'SCHEDULE_FUTURE'
}

export const SCHEDULE_WEEK_TASK_LIST_IDS = [
    TASK_LIST_ID.SCHEDULE_0,
    TASK_LIST_ID.SCHEDULE_1,
    TASK_LIST_ID.SCHEDULE_2,
    TASK_LIST_ID.SCHEDULE_3,
    TASK_LIST_ID.SCHEDULE_4,
    TASK_LIST_ID.SCHEDULE_5,
    TASK_LIST_ID.SCHEDULE_6
]

export const SCHEDULE_TASK_LIST_IDS = [TASK_LIST_ID.SCHEDULE_OVERDUE, ...SCHEDULE_WEEK_TASK_LIST_IDS, TASK_LIST_ID.SCHEDULE_FUTURE]

export type IRephrasedTask = {
    original: string
    rephrased: string
}

export type IUser = {
    id: number
    accountId: string
    name: string
    temporary: boolean
}

export type ScheduleTaskListMeta = {
    fromIncl: DateTime,
    untilExcl: DateTime
}

export type TaskListState = {
    status: 'IDLE' | 'PENDING' | 'SUCCEEDED' | 'FAILED'
    totalElements: number
    allIds: number[],
    meta: ScheduleTaskListMeta
}

export type TaskListsState = {
    taskListId: string
    taskLists: { [key: string]: TaskListState }
    byId: { [key: number]: ITask }
}

export type FetchTaskListQueryParams = {
    type: string,
    offset: number,
    limit: number
}
