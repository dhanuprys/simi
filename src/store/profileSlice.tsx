import { createSlice } from '@reduxjs/toolkit';

export const profile = createSlice({
    name: 'profile',
    initialState: {
        ready: false,
        name: 'Loading',
        username: 'Loading',
        access: '',
        device: {
            id: null,
            name: null
        },
    },
    reducers: {
        setProfile: (state, action) => {
            state.ready = true;
            state.name = action.payload.name;
            state.username = action.payload.username;
            state.access = action.payload.access;
        },
        setDevice: (state, action) => {
            state.device = action.payload;
        }
    }
});

export const {
    setProfile,
    setDevice
} = profile.actions;
export default profile.reducer;
