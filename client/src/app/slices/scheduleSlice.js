import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  institution: '',
  department: '0',
  title: '',
  subtitle: '',
  comment: '',
  days: ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak'],
  style: 'default',
  systemType: 'school',
  validUntil: '',
  instances: [
    {
      group: 'Grupa 1',
      data: [{}, {}, {}, {}, {}],
      defaultTimes: [{ from: '', to: '' }]
    }
  ]
}

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setSchedule(state, action) {
      return action.payload;
    },
    deleteSchedule() {
      return initialState;
    },
    setInstitution(state, action) {
      return {
        ...state,
        institution: action.payload
      }
    }
  }
});

export default scheduleSlice.reducer;
export const {
  schedule, setSchedule, deleteSchedule, setInstitution
} = scheduleSlice.actions;