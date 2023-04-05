'use client';

// import DeviceList from '@/components/control/DeviceList';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import MainPage from '@/components/MainPage';
import { setDashboardContent, setDashboardName } from '@/store/dashboardSlice';
import { useDispatch } from 'react-redux';

const Component = dynamic(() => import('@/components/control/Users'), {
    loading: () => <></>
});

export default function Users() {
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(setDashboardName('application.users'));
        dispatch(setDashboardContent(<Component />));
    });
    
    return <MainPage antiDevice={true} />;
}