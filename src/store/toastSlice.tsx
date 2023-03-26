import { createSlice } from '@reduxjs/toolkit';

export const toast = createSlice({
    name: 'toast',
    initialState: {
        show: false,
        text: '',
        duration: 1000
    },
    reducers: {
        setToast: (state, action) => {
            state.show = action.payload;
        },
        showToast: (state, action) => {
            state.text = action.payload.text,
            state.duration = action.payload.duration,
            state.show = true;
        }
    }
});

export const {
    setToast,
    showToast
} = toast.actions;
export default toast.reducer;
