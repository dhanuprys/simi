'use client';

import { useRef, useState } from 'react';
import axios from 'axios';
import style from './page.module.css';

export default function Login() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const rememberRef = useRef<HTMLInputElement>(null);

    const [ errors, setErrors ] = useState([]);
    let allowLogin = true;

    const doLogin = async () => {
        if (!allowLogin) return;

        allowLogin = false;

        const result = (await axios.post('/api/auth/login', {
            username: usernameRef.current!.value,
            password: passwordRef.current!.value,
            remember: rememberRef.current!.checked
        })).data;

        allowLogin = true;

        if (result.success) {
            // @ts-ignore
            window.location = '/dashboard';
            return;
        }

        setErrors(result.payload.message);
    };

    console.log(errors);

    return (
        <div className={style.container}>
            <div className={style.boxContainer}>
                <div className={`${style.group} ${style.header}`}>
                    <div className={style.greeting}>Selamat Datang !</div>
                    <div className={style.greetingSecond}>Masuk untuk melanjutkan ke dashboard</div>
                </div>
                {
                    errors.length > 0 ?
                    <div className={style.group}>
                        <ul className={style.alert}>
                        {
                            errors.map((text, index) => {
                                return <li key={index}>{text}</li>;
                            })
                        }
                        </ul>
                    </div> : null
                }
                <div className={`${style.group} ${style.form}`}>
                    <label>Username</label>
                    <input ref={usernameRef} className={style.field} type="text" placeholder="Masukkan username" />
                </div>
                <div className={`${style.group} ${style.form}`}>
                    <label>Password</label>
                    <input ref={passwordRef} className={style.field} type="password" placeholder="Masukkan username" />
                </div>
                <div className={`${style.group} ${style.remember}`}>
                    <input ref={rememberRef} className={style.field} type="checkbox" />
                    <label>Ingat saya</label>
                </div>
                <div className={`${style.group}`} onClick={doLogin}>
                    <button className={style.submit}>Masuk</button>
                </div>
            </div>
        </div>
    )
}