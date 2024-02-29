import { apiSlice } from './apiSlice';

export const institutionsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    add: builder.mutation({
      query: credentials => ({
        url: '/institution',
        method: 'POST',
        body: credentials
      }),
      invalidatesTags: ['Institutions']
    }),
    editInstitution: builder.mutation({
      query: ({id, body}) => ({
        url: `/institution/${id}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: (result, error) => error ? [] : ['Institutions'],
    }),
    deleteInstitution: builder.mutation({
      query: id => ({
        url: `/institution/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error) => error ? [] : ['Institutions'],
    }),
    getById: builder.query({
      query: id => ({
        url: `/institution/${id}`
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
        url: '/join',
        method: 'POST',
        body: credentials
      }),
      invalidatesTags: (result, error) => error ? [] : ['Institutions'],
    }),
    joinModerator: builder.mutation({
      query: credentials => ({
        url: '/join_moderator',
        method: 'POST',
        body: credentials
      }),
      invalidatesTags: (result, error) => error ? [] : ['Institutions'],
    }),
    leave: builder.mutation({ 
      query: (id) => ({
        url: `/leave/${id}`,
        method: 'POST'
      }),
      invalidatesTags: (result, error) => error ? [] : ['Institutions']
    }),
    getRole: builder.query({
      query: (id) => ({
        url: `/institution_role/${id}`
      }),
      providesTags: (result, error) => error ? [] : ['Role']
    }),
    getAuthRole: builder.query({
      query: (id) => ({
        url: `/institution_auth/${id}`
      }),
      providesTags: (result, error) => error ? [] : ['Role']
    }),
    changeRole: builder.mutation({
      query: (institution, user) => ({
        url: `/change_role/${institution}/${user}`,
        method: 'patch'
      })
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
  useGetRoleQuery,
  useGetAuthRoleQuery,
  useChangeRoleMutation
} = institutionsApiSlice;