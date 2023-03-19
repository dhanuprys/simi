import DatabaseAdapter from '@/libs/DatabaseAdapter';
import { Low } from 'lowdb';
import { NextResponse } from 'next/server';

export async function GET() {
    const db = new Low(
        new DatabaseAdapter('db/device.json')
    );

    db.data = {
        username: 'admin'
    }
    // await db.write();
    await db.read();

    console.log(db.data)

    return NextResponse.json({
        name: 'dhanu'
    })
}