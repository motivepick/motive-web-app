import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
    CreateTaskRequest,
    ISchedule,
    IScheduleFutureAndOverdue,
    ITask,
    ITaskPositionIndex,
    UpdateTaskRequest
} from '../models/appModel'
import { API_URL } from '../config'
import { ISearchScheduleWeekResponse, ISearchUserTasksResponse } from '../models/redux/taskServiceModel'

export const taskApi = createApi({
    reducerPath: 'taskApi',
    baseQuery: fetchBaseQuery({ baseUrl: API_URL, credentials: 'include' }),
    tagTypes: ['Schedule'],
    endpoints: (builder) => ({
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
                url: `/tasks/${id}/undo-closing`,
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
    useSearchInboxTasksQuery,
    useSearchClosedTasksQuery,
    useUpdateTasksOrderAsyncMutation,
    useCreateTaskMutation,
    useCloseTaskMutation,
    useReopenTaskMutation,
    useUpdateTaskMutation,
    useSearchScheduleQuery
} = taskApi