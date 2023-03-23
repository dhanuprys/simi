'use client';

import { setTheme } from '@/store/pageSlice';
import { RootState } from '@/store/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// @ts-ignore
export default function Theme({ children }): JSX.Element {
    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => state.page.theme);

    useEffect(() => {
        dispatch(setTheme(localStorage.getItem('theme') || 'light'));
    });
    
    return (
        <html style={{ colorScheme: theme }}>{children}</html>
    );
}