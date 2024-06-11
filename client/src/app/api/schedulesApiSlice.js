import { apiSlice } from './apiSlice';

const schedulesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    addSchedule: builder.mutation({
      query: ({ institution, body }) => ({
        url: `/institutions/${institution}/schedules`,
        method: 'POST',
        body
      }),
      providesTags: (result, error) => error ? [] : ['Schedule'], 
      invalidatesTags: (result, error) => error ? [] : ['Schedules']
    }),
    editSchedule: builder.mutation({
      query: ({ institution, schedule, body }) => ({
        url: `/institutions/${institution}/schedules/${schedule}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: (result, error) => error ? [] : ['Schedules', 'Schedule'],
      providesTags: (result, error) => error ? [] : ['Schedule']
    }),
    deleteSchedule: builder.mutation({
      query: ({ institution, schedule }) => ({
        url: `/institutions/${institution}/schedules/${schedule}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error) => error ? [] : ['Schedule', 'Schedules']
    }),
    getSchedules: builder.query({
      query: ({ institution, fullInfo }) => ({
        url: `/institutions/${institution}/schedules${fullInfo ? '?fullInfo=1' : ''}`
      }),
      providesTags: (result, error) => error ? [] : ['Schedules']
    }),
    getScheduleById: builder.query({
      query: ({ institution, schedule }) => ({
        url: `/institutions/${institution}/schedules/${schedule}`
      }),
      providesTags: (result, error) => error ? [] : ['Schedule']
    })
  })
});

export const {
  useAddScheduleMutation,
  useEditScheduleMutation,
  useDeleteScheduleMutation,
  useGetSchedulesQuery,
  useGetScheduleByIdQuery
} = schedulesApiSlice;