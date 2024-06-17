import { apiSlice } from './apiSlice';

export const institutionsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    add: builder.mutation({
      query: credentials => ({
        url: '/institutions',
        method: 'POST',
        body: credentials
      }),
      invalidatesTags: (result, error) => error ? [] : ['Institutions', 'Role']
    }),
    editInstitution: builder.mutation({
      query: ({id, body}) => ({
        url: `/institutions/${id}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: (result, error) => error ? [] : ['Institutions', 'Institution'],
    }),
    deleteInstitution: builder.mutation({
      query: id => ({
        url: `/institutions/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error) => error ? [] : ['Institutions'],
    }),
    institutionChangeCode: builder.mutation({
      query: ({ institution, body }) => ({
        url: `/institutions/${institution}/change_code`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: (result, error) => error ? [] : ['Institution'],
    }),
    getById: builder.query({
      query: ({id, code}) => ({
        url: `/institutions/${id}${code ? '?code=1' : ''}`
      }),
      providesTags: (result, error) => error ? [] : ['Institution']
    }),
    getAll: builder.query({
      query: () => ({
        url: `/user_institutions`
      }),
      providesTags: (result, error) => error ? [] : ['Institutions'],
    }),
    join: builder.mutation({ 
      query: credentials => ({
        url: '/institutions/join',
        method: 'POST',
        body: credentials
      }),
      invalidatesTags: (result, error) => error ? [] : ['Institutions', 'Role'],
    }),
    joinModerator: builder.mutation({
      query: credentials => ({
        url: '/institutions/join_moderator',
        method: 'POST',
        body: credentials
      }),
      invalidatesTags: (result, error) => error ? [] : ['Institutions', 'Role'],
    }),
    leave: builder.mutation({ 
      query: (id) => ({
        url: `/institutions/${id}/leave`,
        method: 'POST'
      }),
      invalidatesTags: (result, error) => error ? [] : ['Institutions']
    }),
    getRole: builder.query({
      query: (id) => ({
        url: `/institutions/${id}/role`
      }),
      providesTags: (result, error) => error ? [] : ['Role']
    }),
    getAuthRole: builder.query({
      query: (id) => ({
        url: `/institutions/${id}/auth`
      }),
      providesTags: (result, error) => error ? [] : ['Role']
    }),
    changeRole: builder.mutation({
      query: ({ institution, user }) => ({
        url: `/institutions/${institution}/role/users/${user}`,
        method: 'patch'
      }),
      invalidatesTags: (result, error) => error ? [] : ['Role']
    }),
		getUsersInInsitution: builder.query({
			query: ({ institution }) => ({
				url: `/institutions/${institution}/users`
			}),
			providesTags: (result, error) => error ? [] : ['Users']
		}),
    
  })
});

export const {
  useAddMutation,
  useEditInstitutionMutation,
  useGetByIdQuery,
  useGetAllQuery,
  useDeleteInstitutionMutation,
  useJoinMutation,
  useJoinModeratorMutation,
  useLeaveMutation,
  useInstitutionChangeCodeMutation,
  useGetRoleQuery,
  useGetAuthRoleQuery,
  useChangeRoleMutation,
	useGetUsersInInsitutionQuery
} = institutionsApiSlice;