import { NextRequest, NextResponse } from 'next/server';
import Database, { LowMix } from '@/libs/Database';
import { Database_User, Database_UserList, Request_CreateUser, Request_DeleteUser } from '@/interface';
import { formInvalid, responseBuilder } from '@/libs/middleware';
import { nanoid } from 'nanoid';
import process from 'process';
import CryptoJS from 'crypto-js';

export async function GET(request: NextRequest) {
    const db = await Database.open<Database_UserList>('user');
    const jwt = request.cookies.getAll();
    console.log(jwt);

    // db.data = { data: [] };await db.write();return;
    db.data?.data.map((value) => {
        value.password = '';
        return value;
    });

    return NextResponse.json(db.data);
}

export async function POST(request: Request) {
    const db = await Database.open<Database_UserList>('user');
    let body: Request_CreateUser;
    let errorMessage: string[] = [];

    try {
        body = await request.json();

        if (
            body.name === undefined 
            || body.username === undefined 
            || body.password === undefined
        ) {
            return formInvalid();
        }
    } catch (e) {
        return formInvalid();
    }

    await db.read();

    for (let i = 0; i < db.data!.data.length; i++) {
        const user = db.data?.data[i];

        if (body.username === user?.username) {
            return responseBuilder(false, {
                message: ['Username sudah digunakan']
            });
        }
    }

    if (body.username.length < 5) {
        errorMessage.push('Username minimal memiliki 5 karakter');
    }

    if (body.password.length < 8) {
        errorMessage.push('Password minimal memiliki 8 karakter');
    }

    if (!['full', 'semi-full', 'readonly'].includes(body.access)) {
        errorMessage.push('Akses user harus sesuai');
    }

    if (errorMessage.length > 0) {
        return responseBuilder(false, {
            message: errorMessage
        });
    }

    let generatedId = nanoid();

    db.data?.data.push({
        id: generatedId,
        name: body.name,
        username: body.username,
        password: CryptoJS.AES.encrypt(body.password, process.env.APP_KEY!).toString(),
        access: body.access,
        disabled: body.disabled || false
    });

    await db.write();

    return responseBuilder(true, {
        id: generatedId
    });
}

export async function DELETE(request: Request) {
    const db: LowMix<Database_UserList> = await Database.open('user');
    let body: Request_DeleteUser;
    let result: Database_User[] = [];
    let found: number = 0;

    try {
        body = await request.json();

        if (body.id === undefined) {
            return formInvalid();
        }
    } catch (e) {
        return formInvalid();
    }

    // EXECUTE
    for (let i = 0; i < db.data!.data.length; i++) {
        if (db.data!.data[i].id === body.id) {
            found++;
            continue;
        }
        result.push(db.data!.data[i]);
    }

    if (found <= 0) {
        return responseBuilder(false, {
            message: [
                'User ID tidak ditemukan'
            ]
        });
    }

    db.data!.data = result;
    await db.write();

    return responseBuilder(true, {
        message: [
            'User berhasil dihapus'
        ]
    })
}