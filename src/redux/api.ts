import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
    CreateTaskRequest,
    IFetchScheduleWeekResponse,
    ISchedule,
    IScheduleFutureAndOverdue,
    ITask,
    ITaskPositionIndex,
    IUser,
    UpdateTaskRequest
} from '../models/appModel'
import { API_URL } from '../config'
import { DateTime } from 'luxon'

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: API_URL, credentials: 'include' }),
    tagTypes: ['Schedule'],
    endpoints: (builder) => ({
        fetchUser: builder.query<IUser, void>({
            query: () => '/user'
        }),
        fetchSchedule: builder.query<ISchedule, void>({
            query: () => ({ url: '/schedule', params: { timeZone: DateTime.local().toFormat('ZZZZ') } }),
            transformResponse: (response: IScheduleFutureAndOverdue & IFetchScheduleWeekResponse) => ({
                ...response.week,
                future: response.future,
                overdue: response.overdue
            }),
            providesTags: ['Schedule']
        }),
        updateTasksOrderAsync: builder.mutation<void, ITaskPositionIndex>({
            query: (taskPositionIndex) => ({
                url: '/orders',
                method: 'POST',
                body: taskPositionIndex
            })
        }),
        createTask: builder.mutation<ITask, CreateTaskRequest>({
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
        reopenTask: builder.mutation<ITask, number>({
            query: (id) => ({
                url: `/tasks/${id}/reopen`,
                method: 'PUT'
            }),
            invalidatesTags: (result) => result?.dueDate ? ['Schedule'] : []
        }),
        updateTask: builder.mutation<ITask, { id: number, request: UpdateTaskRequest }>({
            query: ({ id, request }) => ({
                url: `/tasks/${id}`,
                method: 'PUT',
                body: request
            })
        })
    })
})

export const {
    useFetchUserQuery,
    useUpdateTasksOrderAsyncMutation,
    useCreateTaskMutation,
    useCloseTaskMutation,
    useReopenTaskMutation,
    useUpdateTaskMutation,
    useFetchScheduleQuery
} = api
