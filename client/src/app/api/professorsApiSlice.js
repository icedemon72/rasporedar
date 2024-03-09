import { apiSlice } from './apiSlice';

export const professorsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProfessors: builder.query({
      query: (id) => ({
        url: `/institution_professors/${id}`
      }),
      providesTags: ['Professors']
    }),
    getProfessor: builder.query({
      query: (id) => ({
        url: `/professor/${id}`
      }),
      providesTags: (result, error) => error ? [] : ['Professor']
    }),
    addProfessor: builder.mutation({
      query: ({ institution, body}) => ({
        url: `/professor/${institution}`,
        method: 'POST',
        body
      }),
      invalidatesTags: (result, error) => error ? [] : ['Professors']
    }),
    editProfessor: builder.mutation({
      query: ({ id, body }) => ({
        url: `/professor/${id}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: (result, error) => error ? [] : ['Professors', 'Professor']
    }),
    deleteProfessor: builder.mutation({
      query: (id) => ({
        url: `professor/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error) => error ? [] : ['Professors']
    }),
    getProfessorSubjects: builder.query({
      query: (professor) => ({
        url: `/professor_subject/${professor}`
      }),
      providesTags: (result, error) => error ? [] : ['SubjectProfessors'],
      keepUnusedDataFor: 20,
    })
  })
});

export const {
  useGetProfessorsQuery,
  useGetProfessorQuery,
  useAddProfessorMutation,
  useEditProfessorMutation,
  useDeleteProfessorMutation,
  useGetProfessorSubjectsQuery
} = professorsApiSlice;