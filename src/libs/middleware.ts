import { NextRequest, NextResponse } from 'next/server';
import process from 'process'
import Database from './Database';
import { Database_User, Database_UserList, FallbackCode, Response_GeneralMessage } from '@/interface';
import * as jose from 'jose';

export async function parseToken(request: NextRequest): Promise<false | Database_User> {
    const key = new TextEncoder().encode(process.env.APP_KEY!);
    const db = await Database.open<Database_UserList>('user');
    const token = request.cookies.get('token')?.value;

    let credential;

    try {
        credential = (await jose.jwtVerify(
            token!, 
            key,
            {
                issuer: 'simi:auth:login',
                audience: 'simi:auth:middleware'
            })
        ).payload;
    } catch (e) {
        return false;
    }

    for (let i = 0; i < db.data!.data.length; i++) {
        const current = db.data!.data[i];

        if (current.id === credential.id) {
            current.password = '';
            return current;
        }
    }

    return false;
}

export function responseBuilder<T = any>(
    success: boolean,
    payload: T,
    code: FallbackCode = FallbackCode.NONE,
    init?: ResponseInit
) {
    return NextResponse.json({
        success,
        code,
        payload
    }, init);
}

export function notAuthenticated() {
    return responseBuilder<Response_GeneralMessage>(false, {
        message: [
            'Not authenticated'
        ]
    }, FallbackCode.NOT_AUTHENTICATED, {
        headers: {
            'Set-cookie': 'token=; max-age=0; path=/'
        }
    });
}

export function formInvalid() {
    return responseBuilder<Response_GeneralMessage>(false, {
        message: [
            'Form field harus diisi'
        ]
    });
}

export function rejectReadonly() {
    return responseBuilder<Response_GeneralMessage>(false, {
        message: [
            'Hanya akses full dan semi-full yang dapat menggunakan fitur ini'
        ]
    });
}

export function onlyFullAccess() {
    return responseBuilder<Response_GeneralMessage>(false, {
        message: [
            'Hanya akses full yang dapat menggunakan fitur ini'
        ]
    });
}

export default {
    parseToken,
    notAuthenticated,
    responseBuilder,
    formInvalid,
    rejectReadonly,
    onlyFullAccess
}