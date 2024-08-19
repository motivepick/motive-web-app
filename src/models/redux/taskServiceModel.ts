import { IScheduleWeek, ITask } from '../appModel'

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

export type IPage = {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}

export type ISearchUserTasksResponse = {
    content: ITask[],
    page: IPage,
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

export type IFetchScheduleWeekResponse = {
    week: IScheduleWeek;
}
