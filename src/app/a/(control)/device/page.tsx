'use client';

// import DeviceList from '@/components/control/DeviceList';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import MainPage from '@/components/MainPage';
import { setDashboardContent, setDashboardName } from '@/store/dashboardSlice';
import { useDispatch } from 'react-redux';

const DeviceList = dynamic(() => import('@/components/control/DeviceList'), {
    loading: () => <></>
});

export default function Dashboard() {
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(setDashboardName('dashboard.device'));
        dispatch(setDashboardContent(<DeviceList />));
    });
    
    return <MainPage antiDevice={true} />;
}