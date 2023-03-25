import style from './DashboardMonitor.module.css';

export function DashboardMonitor() {
    return (
        <div className={style.container}>
            <div className={style.general}>
                <div className={`${style.item}`}>
                    First
                </div>
                <div className={style.item}>
                    Second
                </div>
                <div className={style.item}>Third</div>
            </div>
            <div className={style.advance}>
                <div className={style.performance}>
                    Performance
                </div>
                <div className={style.log}>
                    Log
                </div>
            </div>
            <div>3</div>
        </div>
    );
}