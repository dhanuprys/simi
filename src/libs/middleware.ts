import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import process from 'process'
import Database from './Database';
import { Database_User, Database_UserList, Response_GeneralMessage } from '@/interface';

export async function parseToken(request: NextRequest): Promise<false | Database_User> {
    const db = await Database.open<Database_UserList>('user');
    const token = request.cookies.get('token')?.value;

    let credential;

    try {
        credential = <jwt.JwtPayload>jwt.verify(
                                    token!, 
                                    process.env.APP_KEY!
                                    );
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
    init?: ResponseInit
) {
    return NextResponse.json({
        success,
        payload
    }, init);
}

export function notAuthenticated() {
    return responseBuilder<Response_GeneralMessage>(false, {
        message: [
            'Not authenticated'
        ]
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