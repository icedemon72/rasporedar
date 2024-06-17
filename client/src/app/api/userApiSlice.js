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
        url: `/users/${id || ''}`
      }),
      providesTags: ['User']
    }),
		editUser: builder.mutation({
			query: (body) => ({
				url: `/users/edit`,
				method: 'PATCH',
				body
			}),
			invalidatesTags: (result, error) => error ? [] : ['User'],
		})
  })
});

export const {
  useRegisterMutation,
  useGetUserQuery,
	useEditUserMutation
} = userApiSlice;