import { useEffect, useState } from 'react';
import style from './DashboardMonitor.module.css';
import { RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Database_Log, FallbackCode } from '@/interface';
import { setLoading } from '@/store/loadingSlice';
import { showToast } from '@/store/toastSlice';
import Image from 'next/image';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
function LoadItem({ label, percentage }: { label: string, percentage: number }) {
    const percentageStr = percentage.toString() + '%';
    let color = 'green';

    if (percentage >= 90) color = 'red';
    else if (percentage >= 75) color = 'yellow';

    return (
        <div>
            <span className={style.label}>{label}</span>
            <div className={style.loadContainer}>
                <div className={style.loadView}>
                    <div className={style.loadValue} style={{ width: percentageStr, backgroundColor: color }}></div>
                </div>
                <span>{percentageStr}</span>
            </div>
        </div>
    );
}

function map_range(value: number, low1: number, high1: number, low2: number, high2: number) {
    return Math.floor(low2 + (high2 - low2) * (value - low1) / (high1 - low1));
}

export function DashboardMonitor() {
    const dispatch = useDispatch();
    const device = useSelector((state: RootState) => state.profile.device);
    let [ initialLoad, setInitialLoad ] = useState(true);
    const [log, setLog] = useState<Database_Log[]>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const [per_TX, setTX] = useState<number[]>([]);
    const [per_RX, setRX] = useState<number[]>([]);
    const [interfaceName, setInterfaceName] = useState('');
    const [interfaceList, setInterfaceList] = useState<string[]>([]);
    const [deviceInfo, setDeviceInfo] = useState({
        identity: {
            name: null
        },
        resource: {
            'cpu-load': 0,
            'board-name': 'mikrotik',
            version: null,
            'free-hdd-space': 0,
            'total-hdd-space': 0,
            'free-memory': 0,
            'total-memory': 0
        },
        note: {
            note: ''
        },
        interface: []
    });

    const requestDeviceInformation = (withLoading = true) => {
        if (initialLoad) dispatch(setLoading(true));

        console.log(device)

        axios.post('/api/query', {
            deviceId: device.id,
            queries: [
                {
                    label: 'identity',
                    command: '/system/identity/print',
                    args: []
                },
                {
                    label: 'resource',
                    command: '/system/resource/print',
                    args: []
                },
                {
                    label: 'note',
                    command: '/system/note/print',
                    args: []
                },
                {
                    label: 'interface',
                    command: '/interface/print',
                    args: [],
                    bypass: true
                }
            ]
        }).then(response => {
            if (!response.data.success && response.data.code === FallbackCode.DEVICE_NOT_FOUND) {
                // @ts-ignore
                window.location = '/a/device';
            }

            setInitialLoad(false);
            dispatch(setLoading(false));

            if (!response.data.success) {
                dispatch(showToast({
                    text: 'Router tidak dapat dihubungi',
                    duration: 10000
                }));

                if (response.data.code === FallbackCode.DEVICE_NOT_FOUND) {
                    // @ts-ignore
                    window.location = '/a/device';
                } else {
                    setTimeout(() => {
                        window.location = window.location;
                    }, 3000);
                }

                return;
            }

            setDeviceInfo(response.data.payload.data);
        }).catch(() => {
            dispatch(setLoading(false));
        });

        axios.get('/api/log').then(response => {
            setLog(response.data.payload.data);
        })
    }

    const requestPerformance = () => {
        axios.post('/api/query', {
            deviceId: device.id,
            queries: [
                {
                    label: 'interface',
                    command: '/interface/print',
                    args: [
                        '?name=' + interfaceName
                    ],
                    bypass: true
                },
                {
                    label: 'clock',
                    command: '/system/clock/print',
                    args: []
                }
            ]
        }).then(response => {
            if (!response.data.success) return;

            const clock: any = response.data.payload.data.clock;
            let deviceInterface: any = response.data.payload.data.interface;

            deviceInterface = (() => {
                let result;
                for (let i = 0; i < deviceInterface.length; i++) {
                    if (deviceInterface[i].name === interfaceName) {
                        result = deviceInterface[i];
                    }
                }

                return result;
            })();

            if (per_RX.length >= 5) {
                per_RX.shift();
            }

            if (per_TX.length >= 5) {
                per_TX.shift();
            }

            if (labels.length >= 5) {
                labels.shift();
            }

            try {
                per_RX.push(deviceInterface['rx-byte'] / 1000);
                per_TX.push(deviceInterface['tx-byte'] / 1000);
                labels.push(clock.time);

                setRX(per_RX);
                setTX(per_TX);
                setLabels(labels);
            } catch (e) {

            }
        });
    };

    useEffect(() => {
        let looper: any;
        requestDeviceInformation();

        looper = setInterval(() => {
            requestDeviceInformation(false);
        }, 10000);

        return () => {
            clearInterval(looper);
        }
    }, [device.id]);

    useEffect(() => {
        setInitialLoad(true);
    }, [device.id]);

    useEffect(() => {
        let looper: any;

        requestPerformance();

        looper = setInterval(() => {
            requestPerformance();
        }, 3000);

        return () => {
            clearInterval(looper);
        }
    }, [interfaceName]);

    const data = {
        labels,
        datasets: [
            {
                label: 'Tx',
                data: per_TX,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Rx',
                data: per_RX,
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ]
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                // display: true,
                text: 'Chart.js Bar Chart',
            },
        },
    };

    return (
        <div className={style.container}>
            <div className={style.general}>
                <div className={`${style.item}`}>
                    <div className={style.header}>
                        Board
                    </div>
                    <div className={`${style.content} ${style.board}`}>
                        <Image className={style.product} src={'/mikrotik/' + deviceInfo.resource['board-name'] + '.png'} width={100} height={100} alt="Board" />
                        <div className={style.boardStatsContainer}>
                            <div className={style.boardStats}>
                                <span className={style.key}>Identity</span>
                                <span className={style.value}>{deviceInfo.identity.name}</span>
                            </div>
                            <div className={style.boardStats}>
                                <span className={style.key}>Board Name</span>
                                <span className={style.value}>{deviceInfo.resource['board-name']}</span>
                            </div>
                            <div className={style.boardStats}>
                                <span className={style.key}>Version</span>
                                <span className={style.value}>{deviceInfo.resource.version}</span>
                            </div>
                            <div className={style.boardStats}>
                                <span className={style.key}>Interface</span>
                                <span className={style.value}>{deviceInfo.interface.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style.item}>
                    <div className={style.header}>
                        Load
                    </div>
                    <div className={style.content}>
                        <div className={style.load}>
                            <LoadItem label="CPU" percentage={deviceInfo.resource['cpu-load']} />
                            <LoadItem label="HDD" percentage={map_range(deviceInfo.resource['total-hdd-space'] - deviceInfo.resource['free-hdd-space'], 0, deviceInfo.resource['total-hdd-space'], 0, 100)} />
                            <LoadItem label="Memory" percentage={map_range(deviceInfo.resource['total-memory'] - deviceInfo.resource['free-memory'], 0, deviceInfo.resource['total-memory'], 0, 100)} />
                        </div>
                    </div>
                </div>
                <div className={style.item}>
                    <div className={style.header}>
                        Device Note
                    </div>
                    <div className={style.content}>
                        {deviceInfo.note.note}
                    </div>
                </div>
            </div>
            <div className={style.advance}>
                <div className={style.performance}>
                    <div className={style.header}>
                        Performance
                        <div>
                            <select className={style.interfaceSelect} onChange={(e) => { setLabels([]); setRX([]); setTX([]); setInterfaceName(e.target.value)}}>
                                {
                                    deviceInfo.interface.map((iface: any, index) => {
                                        return <option key={index} value={iface.name}>{iface.name}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className={style.content}>
                        <Line options={options} data={data} />
                    </div>
                </div>
                <div className={style.log}>
                    <div className={style.header}>
                        Log
                    </div>
                    <div className={style.content}>
                        {log.map((v: Database_Log, i) => {
                            return (<div key={i} className={style.logSection}>
                                <div className={style.logCircle}></div>
                                <div className={style.logMessage}>{v.message}</div>
                            </div>);
                        })}
                    </div>
                </div>
            </div>
            <div>3</div>
        </div>
    );
}