import { DateTime } from 'luxon'
import { IScheduleWeek, ITask } from '../appModel'

export type ICreateTaskRequest = {
    name: string;
    dueDate?: DateTime;
}

export type IUpdateTaskRequest = {
    name?: string;
    description?: string;
    dueDate?: DateTime;
}

export type ISort = {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
}

export type IPageable = {
    offset: number;
    sort: ISort;
    pageSize: number;
    pageNumber: number;
    paged: boolean;
    unpaged: boolean;
}

export type ISearchUserTasksResponse = {
    content: ITask[],
    pageable: IPageable,
    numberOfElements: number;
    totalElements: number;
    number: number;
    size: number;
    totalPages: number;
    sort: ISort,
    first: boolean;
    last: boolean;
    empty: boolean;
}

export type ISearchScheduleWeekResponse = {
    week: IScheduleWeek;
}
