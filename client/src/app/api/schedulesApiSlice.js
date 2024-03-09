import { apiSlice } from './apiSlice';

const schedulesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getSchedules: builder.mutation({
      query: ({ institution, body }) => ({
        url: `/schedule/${institution}`,
        method: 'POST',
        body
      })
    })
  })
});

export const {
  
} = schedulesApiSlice;