import style from './DeviceList.module.css';
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';
import Image from 'next/image';
import ConnectIcon from '@mui/icons-material/ElectricalServicesOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/ModeOutlined';
import { useState } from 'react';

function DeviceItem() {
    const [ sectionCreate, setSectionCreate ] = useState(false);

    return (
        <div className={style.item}>
            <div className={style.header}>
                <span>Updated 3 years ago</span>
                <StarOutlineOutlinedIcon />
            </div>
            <div className={style.content} style={{  }}>
                <div className={style.boardImage}>
                    <Image alt="rb" src="/mikrotik.png" width={64} height={64} />
                </div>
                <div className={style.info}>
                    <span className={style.name}>Router karangasem</span>
                    <p className={style.description}>Router yang digunakan disana</p>
                </div>
            </div>
            <div className={style.footer}>
                <div>
                    <div className={style.actionButton}><DeleteIcon /></div>
                </div>
                <div style={{ display: 'flex' }}>
                    <div className={style.actionButton} style={{ marginRight: '.5rem' }}><EditIcon /></div>
                    <div className={style.actionButton}><ConnectIcon /></div>
                </div>
            </div>
        </div>
    );
}

export default function DeviceList() {
    return (
        <div className={style.container}>
            <div className={style.toolbar}>
                HELLO
            </div>
            <div className={style.deviceList}>
                <DeviceItem />
                <DeviceItem />
                <DeviceItem />
                <DeviceItem />
                <DeviceItem />
                <DeviceItem />
                <DeviceItem />
                <DeviceItem />
                <DeviceItem />
                <DeviceItem />
                <DeviceItem />
                <DeviceItem />
                <DeviceItem />
                <DeviceItem />
            </div>
        </div>
    );
}