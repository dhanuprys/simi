import { createSlice } from '@reduxjs/toolkit';

const navbar = createSlice({
    name: 'navbar',
    initialState: {
        height: 10,
        searchBar: false,
        searchValue: ''
    },
    reducers: {
        setNavbarSearch: (state, action) => {
            state.searchBar = action.payload;
        },
        setNavbarValue: (state, action) => {
            state.searchValue = action.payload;
        },
        setNavbarHeight: (state, action) => {
            state.height = action.payload;
        }
    }
});

export const {
    setNavbarValue,
    setNavbarSearch,
    setNavbarHeight
} = navbar.actions;
export default navbar.reducer;