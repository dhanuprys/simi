'use client';

import { useEffect } from 'react';
import { DashboardMonitor } from '@/components/control/DashboardMonitor';
import MainPage from '@/components/MainPage';
import { setDashboardContent, setDashboardName } from '@/store/dashboardSlice';
import { useDispatch } from 'react-redux';

export default function Dashboard() {
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(setDashboardName('dashboard.monitor'));
        dispatch(setDashboardContent(<DashboardMonitor />));
    });
    
    return <MainPage />;
}