import { apiSlice } from './apiSlice';

export const institutionsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    add: builder.mutation({
      query: credentials => ({
        url: '/institution',
        method: 'post',
        body: credentials
      }),
      invalidatesTags: ['Institutions']
    }),
    getById: builder.query({
      query: id => ({
        url: `/institution/${id}`
      })
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
        method: 'post',
        body: credentials
      }),
      invalidatesTags: (result, error) => error ? [] : ['Institutions'],
    }),
    joinModerator: builder.mutation({
      query: credentials => ({
        url: '/join_moderator',
        method: 'post',
        body: credentials
      }),
      invalidatesTags: (result, error) => error ? [] : ['Institutions'],
    }),
    leave: builder.mutation({ 
      query: (id) => ({
        url: `/leave/${id}`,
        method: 'post'
      }),
      invalidatesTags: (result, error) => error ? [] : ['Institutions']
    }),
    getRole: builder.query({
      query: (id) => ({
        url: `/institution_role/${id}`
      })
    }),
    getAuthRole: builder.query({
      query: (id) => ({
        url: `/institution_auth/${id}`
      })
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
  useGetByIdQuery,
  useGetAllQuery,
  useJoinMutation,
  useJoinModeratorMutation,
  useLeaveMutation,
  useGetRoleQuery,
  useGetAuthRoleQuery,
  useChangeRoleMutation
} = institutionsApiSlice;