'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import style from './SideNav.module.css';
import { RootState } from '@/store/store';

export default function SideNav() {
    const dashboardName = useSelector((state: RootState) => state.dashboard.name);
    return (
        <div className={style.container}>
            <div className={style.navigation}>
                <div className={style.navigationGroup}>
                    <div className={style.navigationTitle}>Home</div>
                    <ul className={style.navigationList}>
                        <li className={dashboardName === 'dashboard' ? style.active : ''}>
                            <Link href="/dashboard">Dashboard</Link>
                        </li>
                        <li>Resource</li>
                    </ul>
                </div>
                <div className={style.navigationGroup}>
                    <div className={style.navigationTitle}>Hotspot</div>
                    <ul className={style.navigationList}>
                        <li>Monitor</li>
                        <li>Setting</li>
                    </ul>
                </div>
                <div className={style.navigationGroup}>
                    <div className={style.navigationTitle}>Application</div>
                    <ul className={style.navigationList}>
                        <li>Setting</li>
                        <li>Log</li>
                        <li className={dashboardName === 'about' ? style.active : ''}>
                            <Link href="/about">About</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={style.backToDevice}>
                Ganti perangkat
            </div>
        </div>
    );
}