import { apiSlice } from './apiSlice';

export const professorsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProfessors: builder.query({
      query: (id) => ({
        url: `/institutions/${id}/professors`
      }),
      providesTags: ['Professors']
    }),
    getProfessor: builder.query({
      query: ({ institution, id}) => ({
        url: `/institutions/${institution}/professors/${id}`
      }),
      providesTags: (result, error) => error ? [] : ['Professor']
    }),
    addProfessor: builder.mutation({
      query: ({ institution, body}) => ({
        url: `/institutions/${institution}/professors`,
        method: 'POST',
        body
      }),
      invalidatesTags: (result, error) => error ? [] : ['Professors']
    }),
    editProfessor: builder.mutation({
      query: ({ institution, id, body }) => ({
        url: `/institutions/${institution}/professors/${id}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: (result, error) => error ? [] : ['Professors', 'Professor']
    }),
    deleteProfessor: builder.mutation({
      query: ({ institution, id }) => ({
        url: `/institutions/${institution}/professors/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error) => error ? [] : ['Professors']
    }),
    getProfessorSubjects: builder.query({
      query: ({ institution, id }) => ({
        url: `/institutions/${institution}/professors/${id}/subjects`
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