import style from './DeviceList.module.css';
import { useEffect } from 'react';
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';
import Image from 'next/image';
import ConnectIcon from '@mui/icons-material/ElectricalServicesOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/ModeOutlined';
import { useState } from 'react';
import axios from 'axios';
import { Database_DeviceItem } from '@/interface';
import { useDispatch } from 'react-redux';
import { showToast } from '@/store/toastSlice';

function DeviceItem({ id, name }: { id: string, name: string }) {
    const deleteDevice = () => {
        axios.delete('/api/device', {
            data: {
                id
            }
        }).then(response => {
            // if ()
        });
    };

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
                    <span className={style.name}>{name}</span>
                    <p className={style.description}>Router yang digunakan disana</p>
                </div>
            </div>
            <div className={style.footer}>
                <div>
                    <div className={style.actionButton} onClick={deleteDevice}><DeleteIcon /></div>
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
    const dispatch = useDispatch();
    const [ devices, setDevices ] = useState([]);

    useEffect(() => {
        axios.get('/api/device').then(response => {
            if (response.data.success) {
                setDevices(response.data.payload.data);
            }
        });
    }, []);

    dispatch(showToast({
        text: 'HELLO',
        duration: 1000
    }));

    return (
        <div className={style.container}>
            <div className={style.toolbar}>
                HELLO
            </div>
            <div className={style.deviceList}>
                {
                    devices.map((device: Database_DeviceItem) => {
                        return <DeviceItem
                            key={device.id}
                            id={device.id}
                            name={device.name} />
                    })
                }
            </div>
        </div>
    );
}