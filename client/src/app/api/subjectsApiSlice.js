import { apiSlice } from "./apiSlice";

const subjectsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getSubject: builder.query({
      query: ({ institution, id, fullInfo }) => ({
        url: `/institutions/${institution}/subjects/${id}${fullInfo ? '?fullInfo=1' : ''}`
      }),
      keepUnusedDataFor: 15,
      providesTags: (result, error) => error ? [] : ['Subject']
    }),
    getSubjects: builder.query({
      query: ({institution, fullInfo}) => ({
        url: `/institutions/${institution}/subjects${fullInfo ? '?fullInfo=1' : ''}`
      }),
      providesTags: (result, error) => error ? [] : ['Subjects']
    }),
    getSubjectProfessors: builder.query({
      query: ({ institution, id })=> ({
        url: `/institutions/${institution}/subjects/${id}/professors/`
      }),
      keepUnusedDataFor: 20,
    }),
    addSubject: builder.mutation({
      query: ({ institution, body }) => ({
        url: `/institutions/${institution}/subjects`,
        method: 'POST',
        body
      }),
      invalidatesTags: (result, error) => error ? [] : ['Subjects']
    }), 
    editSubject: builder.mutation({
      query: ({ institution, id, body }) => ({
        url: `/institutions/${institution}/subjects/${id}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: (result, error) => error ? [] : ['Subjects', 'SubjectProfessors']
    }),
    deleteSubject: builder.mutation({
      query: ({ institution, id }) => ({
        url: `/institutions/${institution}/subject/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error) => error ? [] : ['Subjects']
    }),
  })
});

export const {
  useGetSubjectQuery,
  useGetSubjectsQuery,
  useGetSubjectProfessorsQuery,
  useAddSubjectMutation,
  useEditSubjectMutation,
  useDeleteSubjectMutation
} = subjectsApiSlice;