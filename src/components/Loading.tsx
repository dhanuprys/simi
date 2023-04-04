import style from './Loading.module.css';
import Image from 'next/image';
import LoadingIcon from '@mui/icons-material/DataUsage';

export default function Loading() {
    return (
        <div className={style.container}>
            {/* <LoadingIcon className={style.icon} fontSize="large" /> */}
            <Image className={style.loadingLogo} src="/logo.svg" alt="Loading" width={50} height={50} />
        </div>
    );
}