'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import style from './MainPage.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import SideBar from './SideBar';
import axios from 'axios';
import { setProfile } from '@/store/profileSlice';
import { setToast } from '@/store/toastSlice';
import Toast from './Toast';

export default function MainPage() {
    const dispatch = useDispatch();
    const navbarHeight = useSelector(
        (state: RootState) => state.navbar.height
    );
    const dashboardContent = useSelector(
        (state: RootState) => state.dashboard.content
    );
    const toast = useSelector((state: RootState) => state.toast);

    useEffect(() => {
        if (toast.show) {
            setTimeout(() => {
                dispatch(setToast(false))
            }, 5000);
        }
    }, [toast]);

    useEffect(() => {
        axios.get('/api/me').then(user => {
            if (!user.data.success) {
                // @ts-ignore
                window.location = '/login';
            }

            dispatch(setProfile(user.data.payload.data));
        }).catch(() => {});
    }, []);

    return (
        <div className={style.container}>
            <SideBar />
            <div className={style.content}>
                <Navbar />
                <div style={{ position: 'relative', minHeight: `calc(100vh - ${navbarHeight}px)`, maxHeight: `calc(100vh - ${navbarHeight}px)`, overflowY: 'auto', background: 'var(--default-bg-negative)' }}>
                    {/* { toast.show ? <Toast text={toast.text} /> : null } */}
                    <Toast text="OK" />
                    {dashboardContent}
                </div>
            </div>
        </div>
    );
}