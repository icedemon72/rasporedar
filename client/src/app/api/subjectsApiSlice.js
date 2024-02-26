import { apiSlice } from "./apiSlice";

const subjectsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getSubject: builder.query({
      query: id => ({
        url: `/subject/${id}`
      }),
      keepUnusedDataFor: 15,
    }),
    getSubjects: builder.query({
      query: institution => ({
        url: `/institution_subjects/${institution}`
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
        method: 'post',
        body
      }),
      invalidatesTags: (result, error) => error ? [] : ['Subjects']
    }), 
    editSubject: builder.mutation({
      query: ({ id, body }) => ({
        url: `/subject/${id}`,
        method: 'patch',
        body
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
  useEditSubjectMutation
} = subjectsApiSlice;