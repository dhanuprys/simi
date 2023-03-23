import { createSlice } from '@reduxjs/toolkit';

export const page = createSlice({
    name: 'page',
    initialState: {
        theme: 'light'
    },
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload
        }
    }
});

export const {
    setTheme
} = page.actions;
export default page.reducer;
