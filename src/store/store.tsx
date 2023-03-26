'use client';

import { configureStore } from '@reduxjs/toolkit';
import navbarSlice from './navbarSlice';
import dashboardSlice from './dashboardSlice';
import pageSlice from './pageSlice';
import profileSlice from './profileSlice';
import toastSlice from './toastSlice';

export const store = configureStore({
    reducer: {
        toast: toastSlice,
        profile: profileSlice,
        navbar: navbarSlice,
        dashboard: dashboardSlice,
        page: pageSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['dashboard/setDashboardContent'],
                // Ignore these paths in the state
                ignoredPaths: ['dashboard.content'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;