'use client';

import MainPage from '@/components/MainPage';
import { setDashboardContent, setDashboardName } from '@/store/dashboardSlice';
import { useDispatch } from 'react-redux';

export default function Dashboard() {
    const dispatch = useDispatch();
    dispatch(setDashboardName('application.about'));
    dispatch(setDashboardContent(<></>));
    
    return <MainPage />;
}