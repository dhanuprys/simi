'use client';

import { useEffect, useRef, useState } from 'react';
import style from './Navbar.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setNavbarHeight, setNavbarSearch, setNavbarValue, setSidebar } from '@/store/navbarSlice';
import { RootState } from '@/store/store';
import Image from 'next/image';
import NotificationsIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/WbSunnyOutlined';
import FullscreenIcon from '@mui/icons-material/FullscreenOutlined';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExitOutlined';
import SideBarIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from 'axios';
import { Database_DeviceItem } from '@/interface';
import { setDevice } from '@/store/profileSlice';

export default function Navbar() {
    const dispatch = useDispatch();
    const profile = useSelector((state: RootState) => state.profile);
    const theme = useSelector((state: RootState) => state.page.theme);
    const deviceId = useSelector((state: RootState) => state.profile.device.id);
    const deviceName = useSelector((state: RootState) => state.profile.device.name);
    const dashboardName = useSelector((state: RootState) => state.dashboard.name);
    const [ isFullscreen, setFullscreen ] = useState(false);
    const [ deviceList, setDeviceList ] = useState<Database_DeviceItem[]>([]);
    const navRef = useRef(null);
    const closeSearchBar = (e: any) => {
        try {
            // @ts-ignore
            if (e.target.attributes.datatype.value === 'sr-container' || e.target.attributes.datatype.value === 'sr-input') {
                return;
            }
        } catch (e) {
            return dispatch(setNavbarSearch(false));
        }

        return dispatch(setNavbarSearch(false));
    };
    const toggleTheme = () => {
        localStorage.setItem('theme', theme === 'dark' ? 'light' : 'dark');
        window.location = window.location;
    };
    const requestFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            setFullscreen(false);
        } else {
            document.body.requestFullscreen();
            setFullscreen(true);
        }
    };
    const activateDevice = (e: any) => {
        let id = e.target.value;
        let name = e.target.innerText;
        localStorage.setItem('device_id', id);
        localStorage.setItem('device_name', name);

        dispatch(setDevice({
            id,
            name
        }));

        // window.location = window.location;
    }

    useEffect(() => {
        // @ts-ignore
        dispatch(setNavbarHeight(navRef.current.clientHeight));
    }, [navRef]);

    useEffect(() => {
        axios.get('/api/device').then(response => {
            if (!response.data.success) return;

            setDeviceList(response.data.payload.data);
        });
    }, [deviceId]);

    return (
        <nav ref={navRef} className={style.container} onMouseDown={closeSearchBar}>
            <div className={style.primary}>
                <div className={style.left}>
                    <div className={style.sidebar} onClick={() => dispatch(setSidebar(true))}>
                        <SideBarIcon />
                    </div>
                </div>
                <div className={style.right}>
                    <ul className={style.navButtons}>
                        <li className={style.buttonItem} onClick={toggleTheme}>
                            { theme !== 'dark' ? <LightModeIcon />  : <DarkModeIcon /> }
                        </li>
                        { /* @ts-ignore */ }
                        <li className={style.buttonItem} onClick={() => window.location = '/a/notifications'}>
                            <NotificationsIcon/>
                        </li>
                        <li className={`${style.buttonItem} ${style.settings}`}>
                            <SettingsIcon />
                        </li>
                        <li className={style.buttonItem} onClick={requestFullscreen}>
                            { isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon /> }
                        </li>
                    </ul>
                    <div className={style.profile}>
                        <Image className={style.picture} src="/user.jpeg" alt="profile" width={32} height={32} />
                        <div className={style.name}>
                            <h3 className={style.username}>{profile.name}</h3>
                            <span className={style.role}>@{profile.username}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.location}>
                <div className={style.highlight}>
                    {
                        deviceId !== null
                        ? <select defaultValue={deviceId} className={style.board}>
                        {
                            deviceList.map(device => {
                                return <option key={device.id} selected={deviceId === device.id} onClick={(e) => activateDevice(e)} value={device.id}>{device.name}</option>
                            })
                        }
                        </select>
                        : null
                    }
                    <div className={style.refresh} onClick={() => window.location = window.location}>
                        <RefreshIcon />
                    </div>
                </div>
                <div className={style.path}>
                    <ul>
                    {
                        dashboardName.split('.').map((sub, index) => {
                            return <li key={index}>{sub} <ArrowForwardIosIcon style={{fontSize: '10px'}} /> </li>
                        })
                    }
                    </ul>
                </div>
            </div>
        </nav>
    );
}