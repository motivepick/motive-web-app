import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '../config'
import { IUser } from '../models/appModel'

export const userApi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: API_URL, credentials: 'include'  }),
    endpoints: (builder) => ({
        fetchUser: builder.query<IUser, void>({
            query: () => '/user'
        })
    })
})

export const { useFetchUserQuery } = userApi