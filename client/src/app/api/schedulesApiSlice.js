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
    editSchedule: builder.mutation({
      query: ({ institution, schedule, body }) => ({
        url: `/schedule/${institution}/${schedule}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: (result, error) => error ? [] : ['Schedules', 'Schedule'],
      providesTags: (result, error) => error ? [] : ['Schedule']
    }),
    deleteSchedule: builder.mutation({
      query: ({ institution, schedule }) => ({
        url: `/schedule/${institution}/${schedule}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error) => error ? [] : ['Schedule', 'Schedules']
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
  useEditScheduleMutation,
  useDeleteScheduleMutation,
  useGetSchedulesQuery,
  useGetScheduleByIdQuery
} = schedulesApiSlice;