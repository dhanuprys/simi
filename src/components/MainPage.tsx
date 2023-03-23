'use client';

import Navbar from '@/components/Navbar';
import style from './MainPage.module.css';
import SideNav from '@/components/SideNav';
import { DashboardMonitor } from '@/components/DashboardMonitor';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import SideBar from './SideBar';

export default function Dashboard() {
    const navbarHeight = useSelector(
        (state: RootState) => state.navbar.height
    );
    const dashboardContent = useSelector(
        (state: RootState) => state.dashboard.content
    );

    return (
        <div className={style.container}>
            <SideBar />
            <div className={style.content}>
                <Navbar />
                <div style={{ minHeight: `calc(100vh - ${navbarHeight}px)`, maxHeight: `calc(100vh - ${navbarHeight}px)`, overflowY: 'auto', background: 'var(--default-bg-negative)' }}>
                    {dashboardContent}
                </div>
            </div>
        </div>
    );
}