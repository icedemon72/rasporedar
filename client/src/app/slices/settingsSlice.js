import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	theme: 'light'
}

const settingsSlice = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		setTheme(state, action) {
			if(action.payload !== 'light' && action.payload !== 'dark') {
				action.payload = 'light';
			} 
			
			return {
				...state,
				theme: action.payload
			}
		}
	}
});

export default settingsSlice.reducer;

export const { settings, setTheme } = settingsSlice.actions;