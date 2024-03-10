import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:3001";


export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl ,
        prepareHeaders: (headers, { getState }: any) => {
            const token = getState().auth.userToken
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
                return headers
            }
        },
    }),
    endpoints: (build) => ({
        getUserDetails: build.query({
            query: () => ({
                url: '/users',
                method: 'GET',
            }),
        }),
    }),
})

// export react hook
export const { useGetUserDetailsQuery } = authApi