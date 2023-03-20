import { Low } from 'lowdb';
import DatabaseAdapter from './DatabaseAdapter';

export type LowMix<T> = Low<T> & { reset: () => void };

export default class Database {
    static async open<T = any>(databaseName: string, defaultValue: T | any = { data: [] }): Promise<LowMix<T>> {
        const db: LowMix<T> = <any>new Low(new DatabaseAdapter(databaseName));
        
        await db.read();
        db.data ||= defaultValue || { data: [] };
        await db.write();

        // Method overriding
        db.reset = async function () {
            db.data ||= defaultValue || { data: [] };
            await this.write();
        }

        return db;
    }
}