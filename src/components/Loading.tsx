import style from './Loading.module.css';
import LoadingIcon from '@mui/icons-material/DataUsage';

export default function Loading() {
    return (
        <div className={style.container}>
            <LoadingIcon className={style.icon} fontSize="large" />
        </div>
    );
}