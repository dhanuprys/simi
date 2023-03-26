'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import style from './MainPage.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import SideBar from './SideBar';
import axios from 'axios';
import { setDevice, setProfile } from '@/store/profileSlice';
import { setToast } from '@/store/toastSlice';
import Toast from './Toast';
import Loading from './Loading';
import { setLoading } from '@/store/loadingSlice';

export default function MainPage({ antiDevice = false }: { antiDevice?: boolean }) {
    const dispatch = useDispatch();
    const navbarHeight = useSelector(
        (state: RootState) => state.navbar.height
    );
    const dashboardContent = useSelector(
        (state: RootState) => state.dashboard.content
    );
    const toast = useSelector((state: RootState) => state.toast);
    const loading = useSelector((state: RootState) => state.loading.show);


    if (!antiDevice) {
        useEffect(() => {
            dispatch(setLoading(true));
            let deviceId = localStorage.getItem('device_id');
            let deviceName = localStorage.getItem('device_name');

            if (deviceId === null || deviceName === null) {
                // @ts-ignore
                window.location = '/a/device';
            }

            dispatch(setDevice({
                id: deviceId,
                name: deviceName
            }));

            dispatch(setLoading(false));
        }, []);
    }

    useEffect(() => {
        if (toast.show) {
            setTimeout(() => {
                dispatch(setToast(false))
            }, toast.duration);
        }
    }, [toast]);

    useEffect(() => {
        axios.get('/api/me').then(user => {
            console.log(user);
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
                    { toast.show ? <Toast text={toast.text} /> : null }
                    { loading ? <Loading /> : null }
                    {/* <Toast text="OK" /> */}
                    {dashboardContent}
                </div>
            </div>
        </div>
    );
}