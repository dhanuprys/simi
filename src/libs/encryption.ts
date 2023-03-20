import CryptoJS from 'crypto-js';
import process from 'process';

export function encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, process.env.DB_CREDENTIAL!).toString();
}

export function decrypt(text: string): string {
    return CryptoJS.AES.decrypt(text, process.env.DB_CREDENTIAL!).toString(CryptoJS.enc.Utf8);
}