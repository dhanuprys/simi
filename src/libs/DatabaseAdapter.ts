import fs from 'fs/promises';
// import path from 'path';
import process from 'process';
import CryptoJS from 'crypto-js';
import { encrypt, decrypt } from './encryption';

const path = {
    join: (d: string, a: string) => d + '/' + a
}

export default class DatabaseAdapter {
    private filePath: string;

    constructor(databaseName: string) {
        this.filePath = path.join(
            process.env.DB_DIRECTORY!,
            CryptoJS.MD5(databaseName).toString()
        );
    }

    async read(): Promise<any> {
        let result;

        try {
            result = await fs.readFile(this.filePath);
        } catch (e) {
            return '';
        }

        return JSON.parse(decrypt(<string>result?.toString()))
    }

    async write(newData: any) {
        newData = JSON.stringify(newData);
        await fs.writeFile(this.filePath, encrypt(newData));
    }
}