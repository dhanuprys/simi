'use client';

import { useRef, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import style from './page.module.css';

export default function Login() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const rememberRef = useRef<HTMLInputElement>(null);

    const [formDisable, setFormDisable] = useState(false);
    const [errors, setErrors] = useState([]);
    let allowLogin = true;

    const listenSubmit = (event: any) => {
        console.log(event);
        if (event.keyCode === 13) {
            doLogin();
        }
    }

    const doLogin = async () => {
        if (!allowLogin) return;

        allowLogin = false;
        setFormDisable(true);

        const result = (await axios.post('/api/auth/login', {
            username: usernameRef.current!.value,
            password: passwordRef.current!.value,
            remember: rememberRef.current!.checked
        })).data;

        allowLogin = true;

        if (result.success) {
            // @ts-ignore
            window.location = '/a/dashboard';
            return;
        }

        setErrors(result.payload.message);
        setFormDisable(false);
    };

    return (
        <div className={style.container} onKeyDown={listenSubmit}>
            <div className={style.boxContainer}>
                <div className={style.logo}>
                    <Image src="/logo.svg" alt="Logo" width={80} height={80} />
                </div>
                <div className={style.box}>
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
                        <input ref={usernameRef} disabled={formDisable} className={style.field} type="text" placeholder="Masukkan username" />
                    </div>
                    <div className={`${style.group} ${style.form}`}>
                        <label>Password</label>
                        <input ref={passwordRef} disabled={formDisable} className={style.field} type="password" placeholder="Masukkan username" />
                    </div>
                    <div className={`${style.group} ${style.remember}`}>
                        <input ref={rememberRef} disabled={formDisable} className={style.field} type="checkbox" />
                        <label>Ingat saya</label>
                    </div>
                    <div className={`${style.group}`} onClick={doLogin}>
                        <button className={style.submit}>Masuk</button>
                    </div>
                </div>
            </div>
        </div>
    )
}