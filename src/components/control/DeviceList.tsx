import style from './DeviceList.module.css';
import { LegacyRef, useEffect, useRef } from 'react';
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';
import Image from 'next/image';
import ConnectIcon from '@mui/icons-material/ElectricalServicesOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/ModeOutlined';
import AddIcon from '@mui/icons-material/AddOutlined';
import BorderOuterIcon from '@mui/icons-material/BorderOuterOutlined';
import { useState } from 'react';
import axios from 'axios';
import { Database_DeviceItem } from '@/interface';
import { useDispatch, useSelector } from 'react-redux';
import { setToast, showToast } from '@/store/toastSlice';
import { setLoading } from '@/store/loadingSlice';
import { setDevice } from '@/store/profileSlice';
import { RootState } from '@/store/store';

function DeviceItem({ id, name, username, hostname, currentDevice, refresh }: { id: string, name: string, username: string, hostname: string, currentDevice: string, refresh: () => void }) {
    const dispatch = useDispatch();
    const activateDevice = () => {
        localStorage.setItem('device_id', id);
        localStorage.setItem('device_name', name);

        dispatch(setDevice({
            id,
            name
        }));

        // @ts-ignore
        window.location = '/a/dashboard';
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
            dispatch(showToast({
                text: 'Tidak dapat menghubungi server',
                duration: 4000
            }))
        }).finally(() => {
            dispatch(setLoading(false));
        });
    };

    console.log(currentDevice)

    return (
        <div className={style.item}>
            <div className={`${style.header} ${id === currentDevice ? style.active : null}`}>
                <span>Updated 3 years ago</span>
                <StarOutlineOutlinedIcon />
            </div>
            <div className={style.content} style={{}}>
                <div className={style.boardImage}>
                    <Image alt="rb" src="/mikrotik/mikrotik.png" width={64} height={64} />
                </div>
                <div className={style.info}>
                    <span className={style.name}>{name}</span>
                    <p className={style.description}>Router yang digunakan disana</p>
                    <em className={style.credential}>{username}@{hostname}</em>
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
    const currentDeviceId = useSelector((state: RootState) => state.profile.device.id);
    const [devices, setDevices] = useState([]);
    const [deviceListView, setDeviceListView] = useState(true);
    const requestDeviceList = (withLoading = false) => {
        if (withLoading) dispatch(setLoading(true));
        axios.get('/api/device').then(response => {
            if (response.data.success) {
                setDevices(response.data.payload.data);
            }
        }).finally(() => {
            dispatch(setLoading(false));
        });
    };

    useEffect(() => {
        requestDeviceList(true);

        let i = setInterval(requestDeviceList, 10000);

        return () => {
            clearInterval(i);
        }
    }, [currentDeviceId]);

    return (
        <div className={style.container}>
            <div className={style.toolbar} onClick={() => setDeviceListView(!deviceListView)}>
                <div className={style.item}>
                    {deviceListView ? <><AddIcon className={style.icon} /> Add device</> : <><BorderOuterIcon className={style.icon} /> Device list</>}
                </div>
            </div>
            {
                deviceListView ?
                    <div className={style.deviceList}>
                        {
                            devices.length <= 0
                                ? <div className={style.item}>
                                    <div className={style.content}>
                                        Add device first
                                    </div>
                                </div>
                                : devices.map((device: Database_DeviceItem) => {
                                    return <DeviceItem
                                        key={device.id}
                                        id={device.id}
                                        name={device.name}
                                        username={device.username}
                                        hostname={device.hostname}
                                        currentDevice={currentDeviceId!}
                                        refresh={requestDeviceList} />
                                })
                        }
                    </div> : <AddDeviceView refresh={requestDeviceList} setDeviceListView={setDeviceListView} />
            }
        </div>
    );
}

function AddDeviceView({ refresh, setDeviceListView }: { refresh: () => void, setDeviceListView: (a: boolean) => void }) {
    const dispatch = useDispatch();
    const name = useRef<HTMLInputElement>(null);
    const hostname = useRef<HTMLInputElement>(null);
    const username = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const port = useRef<HTMLInputElement>(null);
    const description = useRef<HTMLTextAreaElement>(null);

    const submitData = () => {
        axios.post('/api/device', {
            name: name.current!.value,
            hostname: hostname.current!.value,
            username: username.current!.value,
            password: password.current!.value,
            port: port.current!.value,
            description: description.current!.value,
            version: '6.34.x+'
        }).then(response => {
            if (response.data.success) {
                refresh();
                return setDeviceListView(true);
            }

            dispatch(showToast({
                text: response.data.payload.message[0],
                duration: 6000
            }));
        })
    }

    return (
        <div className={style.addDeviceContainer}>
            <div className={style.left}>
                <div className={style.field}>
                    <label className={style.label}>Connection name</label>
                    <input ref={name} className={style.form} type="text" placeholder="Home router" />
                </div>
                <div className={style.field}>
                    <label className={style.label}>Hostname</label>
                    <input ref={hostname} className={style.form} type="text" placeholder="192.168.1.1" />
                </div>
                <div className={style.field}>
                    <label className={style.label}>Username</label>
                    <input ref={username} className={style.form} type="text" placeholder="admin" />
                </div>
                <div className={style.field}>
                    <label className={style.label}>Password</label>
                    <input ref={password} className={style.form} type="text" />
                </div>
                <div className={style.field}>
                    <label className={style.label}>API Port</label>
                    <input ref={port} className={style.form} type="number" defaultValue={8728} />
                </div>
            </div>
            <div className={style.right}>
                <div className={style.field}>
                    <label className={style.label}>Description</label>
                    <textarea ref={description} className={style.textarea}></textarea>
                </div>
            </div>
            <div className={style.submitButton} onClick={submitData}>
                Submit
            </div>
        </div>
    );
}