import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
    ITask,
    ISchedule,
    IScheduleFutureAndOverdue,
    ITaskPositionIndex,
    TaskListTypeAsLiterals
} from '../models/appModel'
import { API_URL } from '../config'
import { ISearchScheduleWeekResponse, ISearchUserTasksResponse } from '../models/redux/taskServiceModel'

export const taskApi = createApi({
    reducerPath: 'taskApi',
    baseQuery: fetchBaseQuery({ baseUrl: API_URL, credentials: 'include' }),
    tagTypes: ['Schedule'],
    endpoints: (builder) => ({
        searchUserTasks: builder.query<ISearchUserTasksResponse, { list: TaskListTypeAsLiterals, offset: number, limit: number }>({
            query: ({ list, offset, limit }) => ({
                url: `/task-lists/${list}`,
                params: { offset, limit }
            })
        }),
        searchInboxTasks: builder.query<ISearchUserTasksResponse, { offset: number, limit: number }>({
            query: ({ offset, limit }) => ({
                url: '/task-lists/INBOX',
                params: { offset, limit }
            })
        }),
        searchClosedTasks: builder.query<ISearchUserTasksResponse, { offset: number, limit: number }>({
            query: ({ offset, limit }) => ({
                url: '/task-lists/CLOSED',
                params: { offset, limit }
            })
        }),
        updateTasksOrderAsync: builder.mutation<void, ITaskPositionIndex>({
            query: (taskPositionIndex) => ({
                url: '/orders',
                method: 'POST',
                body: taskPositionIndex
            })
        }),
        createTask: builder.mutation<ITask, Partial<ITask>>({
            query: (task) => ({
                url: '/tasks',
                method: 'POST',
                body: task
            }),
            invalidatesTags: (result) => result?.dueDate ? ['Schedule'] : []
        }),
        closeTask: builder.mutation<ITask, number>({
            query: (id) => ({
                url: `/tasks/${id}/closing`,
                method: 'PUT'
            })
        }),
        undoCloseTask: builder.mutation<ITask, number>({
            query: (id) => ({
                url: `/tasks/${id}/undo-closing`,
                method: 'PUT'
            }),
            invalidatesTags: ['Schedule']
        }),
        updateTask: builder.mutation<ITask, { id: number, task: ITask }>({
            query: ({ id, task }) => ({
                url: `/tasks/${id}`,
                method: 'PUT',
                body: task
            })
        }),
        searchSchedule: builder.query<ISchedule, void>({
            query: () => '/schedule',
            transformResponse: (response: IScheduleFutureAndOverdue & ISearchScheduleWeekResponse) => ({
                ...response.week,
                future: response.future,
                overdue: response.overdue
            }),
            providesTags: ['Schedule']
        })
    })
})

export const {
    useSearchUserTasksQuery,
    useSearchInboxTasksQuery,
    useSearchClosedTasksQuery,
    useUpdateTasksOrderAsyncMutation,
    useCreateTaskMutation,
    useCloseTaskMutation,
    useUndoCloseTaskMutation,
    useUpdateTaskMutation,
    useSearchScheduleQuery
} = taskApi