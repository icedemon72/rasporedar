import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  institutions: [],
  institution: {}
}

const institutionsSlice = createSlice({
  name: 'session',
  initialState, 
  reducers: {
    setInitial() {
      return initialState;
    },
    setInstitution(state, action) {
      return {
        ...state,
        institution: action.payload
      }
    },
    fillArray(state, action) {
      return {
        ...state,
        institutions: action.payload
      }
    },
  }
});

export default institutionsSlice.reducer;

export const { setInitial, fillArray } = institutionsSlice.actions;