import { apiSlice } from "./apiSlice";

const subjectsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getSubject: builder.query({
      query: ({ id, fullInfo }) => ({
        url: `/subject/${id}${fullInfo ? '?fullInfo=1' : ''}`
      }),
      keepUnusedDataFor: 15,
      providesTags: (result, error) => error ? [] : ['Subject']
    }),
    getSubjects: builder.query({
      query: ({institution, fullInfo}) => ({
        url: `/institution_subjects/${institution}${fullInfo ? '?fullInfo=1' : ''}`
      }),
      providesTags: (result, error) => error ? [] : ['Subjects']
    }),
    getSubjectProfessors: builder.query({
      query: id => ({
        url: `/subject_professors/${id}`
      }),
      keepUnusedDataFor: 20,
    }),
    addSubject: builder.mutation({
      query: ({ institution, body }) => ({
        url: `/subject/${institution}`,
        method: 'POST',
        body
      }),
      invalidatesTags: (result, error) => error ? [] : ['Subjects']
    }), 
    editSubject: builder.mutation({
      query: ({ id, body }) => ({
        url: `/subject/${id}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: (result, error) => error ? [] : ['Subjects', 'SubjectProfessors']
    }),
    deleteSubject: builder.mutation({
      query: (id) => ({
        url: `/subject/${id}`,
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