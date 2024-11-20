import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { CreateTaskRequest, IRephrasedTask, ITask, ITaskPositionIndex, IUser, UpdateTaskRequest } from '../models/appModel'
import { API_URL } from '../config'
import { DateTime } from 'luxon'
import { SCHEDULE_TAG } from './tags'

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: API_URL, credentials: 'include' }),
    tagTypes: [SCHEDULE_TAG],
    endpoints: (builder) => ({
        rephraseTask: builder.mutation<IRephrasedTask, string>({
            query: (originalTask) => ({
                url: '/rephrase',
                method: 'POST',
                body: originalTask
            })
        }),
        fetchUser: builder.query<IUser, void>({
            query: () => '/user'
        }),
        fetchSchedule: builder.query<ITask[], void>({
            query: () => ({ url: '/schedule', params: { timeZone: DateTime.local().toFormat('ZZZZ') } }),
            providesTags: [SCHEDULE_TAG]
        }),
        updateTasksOrderAsync: builder.mutation<ITask, ITaskPositionIndex>({
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
            invalidatesTags: (result) => result?.dueDate ? [SCHEDULE_TAG] : []
        }),
        closeTask: builder.mutation<ITask, number>({
            query: (id) => ({
                url: `/tasks/${id}/closing`,
                method: 'PUT'
            }),
            invalidatesTags: () => [SCHEDULE_TAG]
        }),
        reopenTask: builder.mutation<ITask, number>({
            query: (id) => ({
                url: `/tasks/${id}/reopen`,
                method: 'PUT'
            }),
            invalidatesTags: (result) => result?.dueDate ? [SCHEDULE_TAG] : []
        }),
        updateTask: builder.mutation<ITask, { id: number, request: UpdateTaskRequest }>({
            query: ({ id, request }) => ({
                url: `/tasks/${id}`,
                method: 'PUT',
                body: request
            }),
            invalidatesTags: () => [SCHEDULE_TAG]
        })
    })
})

export const {
    useRephraseTaskMutation,
    useFetchUserQuery,
    useUpdateTasksOrderAsyncMutation,
    useCreateTaskMutation,
    useCloseTaskMutation,
    useReopenTaskMutation,
    useUpdateTaskMutation,
    useFetchScheduleQuery
} = api
