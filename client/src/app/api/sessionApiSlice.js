import { apiSlice, tags } from './apiSlice';
import { setAccess, setRefresh, loggedOut } from '../slices/sessionSlice';

export const sessionApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: credentials => ({
        url: '/login',
        method: 'POST',
        body: credentials
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAccess(data.access_token));
          dispatch(setRefresh(data.refresh_token));
        } catch (err) {
          dispatch(loggedOut());
        }
      }
    }),
    logout: builder.mutation({
      query: (credentials) => ({
        url: '/logout',
        method: 'POST',
        body: credentials
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(loggedOut());
          dispatch(apiSlice.util.resetApiState());
        }
      },
    })
  })
});

export const {
  useLoginMutation,
  useLogoutMutation
} = sessionApiSlice;