import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { CreateTaskRequest, IRephrasedTask, ITask, IUser, TaskPositionChange, UpdateTaskRequest } from '../models/appModel'
import { API_URL } from '../config'
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
            query: () => ({ url: '/schedule' }),
            providesTags: [SCHEDULE_TAG]
        }),
        updateTasksOrderAsync: builder.mutation<ITask, TaskPositionChange>({
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
            })
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
            })
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
    useRephraseTaskMutation,
    useFetchUserQuery,
    useUpdateTasksOrderAsyncMutation,
    useCreateTaskMutation,
    useCloseTaskMutation,
    useReopenTaskMutation,
    useUpdateTaskMutation,
    useFetchScheduleQuery
} = api
