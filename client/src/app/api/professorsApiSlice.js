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
      keepUnusedDataFor: 15,
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
      invalidatesTags: (result, error) => error ? [] : ['Professors']
    }),
    deleteProfessor: builder.mutation({
      query: (credentials) => ({
        url: `professors/${credentials}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error) => error ? [] : ['Professors']
    }),
    getProfessorSubjects: builder.query({
      query: (professor) => ({
        url: `/professor_subject/${professor}`
      }),
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