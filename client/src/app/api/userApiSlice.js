import { apiSlice } from './apiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    register: builder.mutation({
      query: credentials => ({
        url: '/register',
        method: 'POST',
        body: credentials
      })
    }),
    getUser: builder.query({
      query: id => ({
        url: `/user/${id || ''}`
      }),
      providesTags: ['User']
    })
  })
});

export const {
  useRegisterMutation,
  useGetUserQuery
} = userApiSlice;