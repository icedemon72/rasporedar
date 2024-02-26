import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	accessToken: '',
	refreshToken: ''
}

const sessionSlice = createSlice({
	name: 'session',
	initialState,
	reducers: {
		setAccess(state, action) {
			return {
				...state,
				accessToken: action.payload
			}
		},
		setRefresh(state, action) {
			return {
				...state,
				refreshToken: action.payload
			}
		},
		loggedOut() {
			return initialState;
		},
	}
});

export default sessionSlice.reducer;
export const { session, loggedOut, setAccess, setRefresh } = sessionSlice.actions;
