import style from './Toast.module.css';

export default function Toast({ text }: { text: string }) {
    return (
        <div className={style.container}><strong>{text}</strong></div>
    );
}