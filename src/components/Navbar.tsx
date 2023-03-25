'use client';

import { useEffect, useRef, useState } from 'react';
import style from './Navbar.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setNavbarHeight, setNavbarSearch, setNavbarValue } from '@/store/navbarSlice';
import { RootState } from '@/store/store';
import Image from 'next/image';
import NotificationsIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/WbSunnyOutlined';
import FullscreenIcon from '@mui/icons-material/FullscreenOutlined';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExitOutlined';
import SideBarIcon from '@mui/icons-material/DashboardCustomizeOutlined';

export default function Navbar() {
    const dispatch = useDispatch();
    const profile = useSelector((state: RootState) => state.profile);
    // const searchBarState = useSelector((state: RootState) => state.navbar.searchBar);
    // const searchBarValue = useSelector((state: RootState) => state.navbar.searchValue);
    const theme = useSelector((state: RootState) => state.page.theme);
    const [ isFullscreen, setFullscreen ] = useState(false);
    // @ts-ignore
    const navRef = useRef();
    const closeSearchBar = (e: MouseEvent) => {
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

    useEffect(() => {
        // @ts-ignore
        dispatch(setNavbarHeight(navRef.current.clientHeight));
    }, [navRef]);

    return (
        // @ts-ignore
        <nav ref={navRef} className={style.container} onMouseDown={(e) => closeSearchBar(e)}>
            <div className={style.primary}>
                <div className={style.left}>
                    <div className={style.sidebar}>
                        <SideBarIcon />
                    </div>
                </div>
                <div className={style.right}>
                    <ul className={style.navButtons}>
                        <li className={style.buttonItem} onClick={toggleTheme}>
                            { theme !== 'dark' ? <LightModeIcon />  : <DarkModeIcon /> }
                        </li>
                        { /* @ts-ignore */ }
                        <li className={style.buttonItem} onClick={() => window.location = '/notifications'}>
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
                        <Image className={style.picture} src="/thirteen.svg" alt="profile" width={32} height={32} />
                        <div className={style.name}>
                            <h3 className={style.username}>{profile.name}</h3>
                            <span className={style.role}>@{profile.username}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.location}>
                <div className={style.highlight}>
                    <select className={style.board}>
                        <option>RouterOS v7.8</option>
                    </select>
                </div>
                <div className={style.path}>
                    Dashboard
                </div>
            </div>
            {/* <div className={style.sidenavToggle}>side</div>
            <div className={style.logo} onClick={() => dispatch(setNavbarHeight(10))}>logo</div>
            <div className={style.navigation}>
                <div className={style.title} style={{ display: searchBarState ? 'none' : 'block' }} onMouseEnter={() => dispatch(setNavbarSearch(true))}>RouterOS v7.7 (Dhanu)</div>
                <div datatype="sr-container" className={style.searchBar} style={{ display: searchBarState ? 'block' : 'none' }}>
                    <input defaultValue={searchBarValue} onChange={(e) => dispatch(setNavbarValue(e.target.value))} datatype="sr-input" type="text" placeholder="Apa yang ingin anda cari?" />
                </div>
            </div>
            <div className={style.account}>
                <div onClick={toggleTheme} className={`${style.switchContainer} ${theme === 'dark' ? style.themeDark : ''}`}>
                    <div className={style.ball}></div>
                </div>
                <div className={style.info}>
                    <label style={{ marginRight: '5px' }}>Dhanu</label>
                    <img className={style.profilePhoto} />
                </div>
            </div> */}
        </nav>
    );
}