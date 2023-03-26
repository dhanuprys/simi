import { createSlice } from '@reduxjs/toolkit';

const navbar = createSlice({
    name: 'navbar',
    initialState: {
        height: 0,
        searchBar: false,
        searchValue: '',
        sidebar: false
    },
    reducers: {
        setSidebar: (state, action) => {
            state.sidebar = action.payload;
        },
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
    setSidebar,
    setNavbarValue,
    setNavbarSearch,
    setNavbarHeight
} = navbar.actions;
export default navbar.reducer;