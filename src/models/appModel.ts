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

export type IFetchScheduleWeekResponse = {
    week: IScheduleWeek
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

export type ITaskPositionIndex = {
    sourceListType: string
    taskId: number
    destinationListType: string
    destinationIndex: number
}

export enum TASK_LIST_ID {
    INBOX = 'INBOX',
    CLOSED = 'CLOSED'
}

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

export type IScheduleFutureAndOverdue = {
    future: ITask[]
    overdue: ITask[]
}

export type IScheduleWeek = {
    [day: string]: ITask[]
}

export type ISchedule = IScheduleFutureAndOverdue & IScheduleWeek

export type TaskListState = {
    status: 'IDLE' | 'PENDING' | 'SUCCEEDED' | 'FAILED'
    totalElements: number
    allIds: number[]
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
