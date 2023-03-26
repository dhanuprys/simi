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
import { setLoading } from '@/store/loadingSlice';
import { setDevice } from '@/store/profileSlice';

function DeviceItem({ id, name, refresh }: { id: string, name: string, refresh: () => void }) {
    const dispatch = useDispatch();
    const currentDevice = localStorage.getItem('device_id');
    const activateDevice = () => {
        localStorage.setItem('device_id', id);
        localStorage.setItem('device_name', name);

        dispatch(setDevice({
            id,
            name
        }));

        refresh();
    };
    const deleteDevice = () => {
        dispatch(setLoading(true));
        axios.delete('/api/device', {
            data: {
                id
            }
        }).then(response => {
            if (response.data.success) {
                refresh();

                dispatch(showToast({
                    text: 'Berhasil menghapus perangkat',
                    duration: 4000
                }));
            }
        }).catch(() => {

        }).finally(() => {
            dispatch(setLoading(false));
        });
    };

    return (
        <div className={style.item}>
            <div className={`${style.header} ${id === currentDevice ? style.active : null}`}>
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
                    <div className={style.actionButton} onClick={activateDevice}><ConnectIcon /></div>
                </div>
            </div>
        </div>
    );
}

export default function DeviceList() {
    const dispatch = useDispatch();
    const [ devices, setDevices ] = useState([]);
    const requestDeviceList = () => {
        dispatch(setLoading(true));
        axios.get('/api/device').then(response => {
            if (response.data.success) {
                setDevices(response.data.payload.data);
            }
        }).finally(() => {
            dispatch(setLoading(false));
        });
    };

    useEffect(() => {
        requestDeviceList();

        let i = setInterval(requestDeviceList, 10000);

        return () => {
            clearInterval(i);
        }
    }, []);

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
                            name={device.name}
                            refresh={requestDeviceList} />
                    })
                }
            </div>
        </div>
    );
}