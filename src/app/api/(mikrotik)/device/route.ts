import { type NextRequest, NextResponse } from 'next/server';
import Database from '@/libs/Database';
import { isAuthenticate, notAuthenticated } from '@/libs/middleware';

type DeviceItem = {
    id: string,
    name: string,
    user: string,
    password: string,
    version: '6.x' | '7.x',
    expireAt: number | false
};
type DeviceList = DeviceItem[];

const db = Database.open<DeviceList>('device');

export async function GET(request: NextRequest) {
    

    await db.read();
    return NextResponse.json(db.data);
}

export async function POST(request: NextRequest) {
    const body = request.json();
    const token = request.cookies.get('token');

    await db.read();
    db.data?.push({
        id: 'ffafafadf',
        name: 'Router-1',
        user: 'admin',
        password: 'admin',
        version: '6.x',
        expireAt: Math.floor(Date.now() / 1000) + (60 * 15) // 15min
    });

    await db.write();
}

export async function PATCH(request: Request) {
    await db.read();
    for (let i: number = 0; i < db.data!.length; i++) {
        if (db.data![i].id !== ID) continue;
    }
}

export async function DELETE(request: Request) {
    await db.read();
    for (let i: number = 0; i < db.data!.length; i++) {
        if (db.data![i].id !== ID) continue;
    }
    await db.write();
}