import { createSlice } from '@reduxjs/toolkit';

export const profile = createSlice({
    name: 'profile',
    initialState: {
        ready: false,
        name: 'Loading',
        username: 'Loading',
        access: ''
    },
    reducers: {
        setProfile: (state, action) => {
            state.ready = true;
            state.name = action.payload.name;
            state.username = action.payload.username;
            state.access = action.payload.access;
        }
    }
});

export const {
    setProfile
} = profile.actions;
export default profile.reducer;
