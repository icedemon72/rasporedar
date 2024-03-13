import { apiSlice } from './apiSlice';

const schedulesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    addSchedule: builder.mutation({
      query: ({ institution, body }) => ({
        url: `/schedule/${institution}`,
        method: 'POST',
        body
      }),
      invalidatesTags: (result, error) => error ? [] : ['Schedules']
    }),
    getSchedules: builder.query({
      query: ({ institution, fullInfo }) => ({
        url: `/schedule/${institution}${fullInfo ? '?fullInfo=1' : ''}`
      }),
      providesTags: (result, error) => error ? [] : ['Schedules']
    })
  })
});

export const {
  useAddScheduleMutation,
  useGetSchedulesQuery
} = schedulesApiSlice;