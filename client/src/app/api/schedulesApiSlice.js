import { apiSlice } from './apiSlice';

const schedulesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    addSchedule: builder.mutation({
      query: ({ institution, body }) => ({
        url: `/schedule/${institution}`,
        method: 'POST',
        body
      }),
      providesTags: (result, error) => error ? [] : ['Schedule'], 
      invalidatesTags: (result, error) => error ? [] : ['Schedules']
    }),
    getSchedules: builder.query({
      query: ({ institution, fullInfo }) => ({
        url: `/schedule/${institution}${fullInfo ? '?fullInfo=1' : ''}`
      }),
      providesTags: (result, error) => error ? [] : ['Schedules']
    }),
    getScheduleById: builder.query({
      query: ({ institution, schedule }) => ({
        url: `/schedule/${institution}/${schedule}`
      }),
      providesTags: (result, error) => error ? [] : ['Schedule']
    })
  })
});

export const {
  useAddScheduleMutation,
  useGetSchedulesQuery,
  useGetScheduleByIdQuery
} = schedulesApiSlice;