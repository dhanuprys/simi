import { createSlice } from '@reduxjs/toolkit';

export const loading = createSlice({
    name: 'loading',
    initialState: {
        show: false,
    },
    reducers: {
        setLoading: (state, action) => {
            state.show = action.payload;
        },
    }
});

export const {
    setLoading,
} = loading.actions;
export default loading.reducer;
