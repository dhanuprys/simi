import { NextResponse } from 'next/server';
import { Routeros } from 'routeros-node';
import Database from '@/libs/Database';

export async function GET(request: Request) {
    const db = Database.open('device');

    const ros = new Routeros({
        host: '192.168.110.11',
        user: 'admin',
        password: '',
        port: 8728,
        timeout: 3
    });

    let conn;
    try {
        conn = await ros.connect();
    } catch (e) {
        return NextResponse.json({
            error: 1
        });
    }

    const address = await conn.write(['/ip/address/print'])

    conn.destroy()

    return NextResponse.json(address)
}