'use client';

import style from './SideBar.module.css';
import { useEffect, useState } from 'react';
import SpeedIcon from '@mui/icons-material/SpeedOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import EditIcon from '@mui/icons-material/BorderColorOutlined';
import GiftIcon from '@mui/icons-material/CardGiftcardOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import NotificationsIcon from '@mui/icons-material/NotificationsOutlined';
import UserIcon from '@mui/icons-material/PeopleAltOutlined';
import AboutIcon from '@mui/icons-material/InfoOutlined';
import LogIcon from '@mui/icons-material/FormatListBulletedOutlined';
import VirtualLogIcon from '@mui/icons-material/SatelliteAltOutlined';
import RouterIcon from '@mui/icons-material/DashboardOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setSidebar } from '@/store/navbarSlice';

function NavItem({ 
    name, 
    dashboardName, 
    icon, 
    label,
    location
}: { 
    name: string, 
    dashboardName: string, 
    icon: any, 
    label: string,
    location: string
}) {
    return (
        <div 
            className={`${style.item} ${dashboardName === name ? style.active : ''}`} 
            // @ts-ignore
            onClick={() => window.location = location}>
            {icon}
            <span className={style.label}>{label}</span>
            <KeyboardArrowRightIcon className={style.forward} fontSize="small" />
        </div>
    );
}

export default function SideBar() {
    const dispatch = useDispatch();
    const dashboardName = useSelector((state: RootState) => state.dashboard.name);
    const sideBarOpen = useSelector((state: RootState) => state.navbar.sidebar);
    const [ localSideBar, setLocalSideBar ] = useState(true);
    let listener = function() {
        console.log(window.innerWidth);
        if (window.innerWidth > 870) {
            setLocalSideBar(true);
        } else {
            setLocalSideBar(false);
        }
    };

    useEffect(() => {
        listener();
        window.addEventListener('resize', listener);

        return () => {
            window.removeEventListener('resize', listener);
        };
    });

    return (
        <div className={style.container} style={{ transform: localSideBar ? 'translateX(0)' : (sideBarOpen ? 'translateX(0)' : 'translateX(-100%)') }}>
            <div className={style.toggleButton} onClick={() => dispatch(setSidebar(false))}><ClearIcon /></div>
            <div className={style.logoContainer}>
                <img className={style.logo} src="/thirteen.svg" height={42} />
            </div>
            <div className={style.navigation}>
                <div className={style.group}>
                    <h4 className={style.title}>DASHBOARD</h4>
                    <div className={style.list}>
                        <NavItem
                            name="dashboard.monitor"
                            dashboardName={dashboardName}
                            icon={<SpeedIcon />}
                            location="/a/dashboard"
                            label="Monitor" />
                        <NavItem
                            name="dashboard.device"
                            dashboardName={dashboardName}
                            icon={<RouterIcon />}
                            location="/a/device"
                            label="Device" />
                    </div>
                </div>
                <div className={style.group}>
                    <h4 className={style.title}>HOTSPOT</h4>
                    <div className={style.list}>
                        <NavItem
                            name="hotspot.monitor"
                            dashboardName={dashboardName}
                            icon={<SpeedIcon />}
                            location="/a/hotspot-monitor"
                            label="Monitor" />
                        <NavItem
                            name="hotspot.template"
                            dashboardName={dashboardName}
                            icon={<EditIcon />}
                            location="/a/hotspot-template"
                            label="Template" />
                        <NavItem
                            name="hotspot.voucher"
                            dashboardName={dashboardName}
                            icon={<GiftIcon />}
                            location="/a/voucher"
                            label="Voucher" />
                        <NavItem
                            name="hotspot.template"
                            dashboardName={dashboardName}
                            icon={<VirtualLogIcon />}
                            location="/a/hotspot-template"
                            label="Virtual Log" />
                    </div>
                </div>
                <div className={style.group}>
                    <h4 className={style.title}>APPLICATION</h4>
                    <div className={style.list}>
                        <NavItem
                            name="application.users"
                            dashboardName={dashboardName}
                            icon={<UserIcon />}
                            location="/a/users"
                            label="Users" />
                        <NavItem
                            name="application.notifications"
                            dashboardName={dashboardName}
                            icon={<NotificationsIcon />}
                            location="/a/notifications"
                            label="Notification" />
                        <NavItem
                            name="application.log"
                            dashboardName={dashboardName}
                            icon={<LogIcon />}
                            location="/a/app-log"
                            label="Log" />
                        <NavItem
                            name="application.settings"
                            dashboardName={dashboardName}
                            icon={<SettingsIcon />}
                            location="/a/app-settings"
                            label="Settings" />
                        <NavItem
                            name="application.about"
                            dashboardName={dashboardName}
                            icon={<AboutIcon />}
                            location="/a/about"
                            label="About" />
                    </div>
                </div>
            </div>
        </div>
    );
}