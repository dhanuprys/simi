import { NextRequest, NextResponse } from 'next/server';
import Database, { LowMix } from '@/libs/Database';
import { Database_User, Database_UserList, Request_CreateUser, Request_DeleteUser, Request_UpdateUser, Response_GeneralData, Response_GeneralMessage } from '@/interface';
import middleware from '@/libs/middleware';
import { nanoid } from 'nanoid';
import process from 'process';
import CryptoJS from 'crypto-js';

export async function GET(request: NextRequest) {
    const db = await Database.open<Database_UserList>('user');
    const auth = await middleware.parseToken(request);

    if (!auth) return middleware.notAuthenticated();

    // Menghapus password pada response
    db.data?.data.map((value) => {
        value.password = '';
        return value;
    });

    return middleware.responseBuilder<Response_GeneralData<Database_User[]>>(true, {
        data: db.data!.data
    })
}

export async function POST(request: NextRequest) {
    const db = await Database.open<Database_UserList>('user');
    const auth = await middleware.parseToken(request);
    let body: Request_CreateUser;
    let errorMessage: string[] = [];
    let generatedId = nanoid();

    if (!auth) return middleware.notAuthenticated();
    if (auth.access === 'readonly') return middleware.rejectReadonly();

    try {
        body = await request.json();

        if (
            body.name === undefined 
            || body.username === undefined 
            || body.password === undefined
            || body.access === undefined
            || body.disabled === undefined
        ) {
            return middleware.formInvalid();
        }
    } catch (e) {
        return middleware.formInvalid();
    }

    await db.read();

    for (let i = 0; i < db.data!.data.length; i++) {
        const user = db.data?.data[i];

        if (body.username === user?.username) {
            return middleware.responseBuilder<Response_GeneralMessage>(false, {
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
        return middleware.responseBuilder<Response_GeneralMessage>(false, {
            message: errorMessage
        });
    }

    db.data?.data.push({
        id: generatedId,
        name: body.name,
        username: body.username,
        password: CryptoJS.AES.encrypt(
            body.password, process.env.APP_KEY!
        ).toString(),
        access: body.access,
        disabled: body.disabled || false,
        created_at: new Date,
        updated_at: new Date
    });

    await db.write();

    return middleware.responseBuilder<Response_GeneralData>(true, {
        data: {
            id: generatedId
        }
    });
}

export async function PUT(request: NextRequest) {
    const db: LowMix<Database_UserList> = await Database.open('user');
    const auth = await middleware.parseToken(request);
    let body: Request_UpdateUser;
    
    if (!auth) return middleware.notAuthenticated();
    if (auth.access === 'readonly') return middleware.rejectReadonly();

    try {
        body = await request.json();

        if (
            body.id === undefined 
            || body.name === undefined 
            || body.username === undefined
            || body.access === undefined
            || body.disabled === undefined
        ) {
            return middleware.formInvalid();
        }
    } catch (e) {
        return middleware.formInvalid();
    }

    for (let i = 0; i < db.data!.data.length; i++) {
        const current = db.data!.data[i];
        if (body.id !== current.id) continue;

        db.data!.data[i] = {
            id: current.id,
            name: body.name || current.name,
            username: body.username || current.username,
            password: body.password || current.password,
            access: body.access || current.access,
            disabled: body.disabled || current.disabled,
            created_at: current.created_at,
            updated_at: new Date
        }
    }

    await db.write();

    return middleware.responseBuilder<Response_GeneralMessage>(true, {
        message: [
            'User berhasil diperbarui'
        ]
    });
}

export async function DELETE(request: NextRequest) {
    const db: LowMix<Database_UserList> = await Database.open('user');
    const auth = await middleware.parseToken(request);
    let body: Request_DeleteUser;
    let result: Database_User[] = [];
    let found: number = 0;

    if (!auth) return middleware.notAuthenticated();
    if (auth.access !== 'full') return middleware.onlyFullAccess();

    try {
        body = await request.json();

        if (body.id === undefined) {
            return middleware.formInvalid();
        }
    } catch (e) {
        return middleware.formInvalid();
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
        return middleware.responseBuilder<Response_GeneralMessage>(false, {
            message: [
                'User ID tidak ditemukan'
            ]
        });
    }

    db.data!.data = result;
    await db.write();

    return middleware.responseBuilder<Response_GeneralMessage>(true, {
        message: [
            'User berhasil dihapus'
        ],
    });
}