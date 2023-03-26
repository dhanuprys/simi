import { createSlice } from '@reduxjs/toolkit';

export const dashboard = createSlice({
    name: 'dashboard',
    initialState: {
        name: '',
        content: <>Loading...</>
    },
    reducers: {
        setDashboardName: (state, action) => {
            state.name = action.payload;
        },
        setDashboardContent: (state, action) => {
            state.content = action.payload;
        }
    }
});

export const {
    setDashboardName,
    setDashboardContent
} = dashboard.actions;
export default dashboard.reducer;
