import fs from 'fs/promises';
import { encrypt, decrypt } from './encryption';

export default class DatabaseAdapter {
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    async read(): Promise<any> {
        let result;

        try {
            result = await fs.readFile(this.filePath);
        } catch (e) {

        }

        return JSON.parse(decrypt(<string>result?.toString()))
    }

    async write(newData: any) {
        newData = JSON.stringify(newData);
        await fs.writeFile(this.filePath, encrypt(newData));
    }
}