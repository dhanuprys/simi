import { Database_Log, Database_LogList } from '@/interface';
import Database from './Database';
import { nanoid } from 'nanoid';

export class Logging {
    protected databaseName: string;

    constructor(databaseName: string) {
        this.databaseName = databaseName;
    }

    async add(level: Database_Log['level'] = 'critical', message: Database_Log['message']): Promise<boolean> {
        const db = await Database.open<Database_LogList>(this.databaseName);

        if (db.data!.data.length >= 100) {
            db.data!.data = [];
        }

        db.data!.data.push({
            id: nanoid(),
            level,
            message,
            timestamp: new Date()
        });

        await db.write();

        return true;
    }

    async read() {
        const db = await Database.open<Database_LogList>(this.databaseName);

        return db.data!.data;
    }
}

const log = new Logging('log');

export default log;