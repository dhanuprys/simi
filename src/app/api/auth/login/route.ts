import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import process from 'process';
import { Database_User, Database_UserList, Request_Login } from '@/interface';
import { formInvalid, responseBuilder } from '@/libs/middleware';
import Database, { LowMix } from '@/libs/Database';
import CryptoJS from 'crypto-js';

export async function POST(request: Request) {
    const db: LowMix<Database_UserList> = await Database.open('user');
    let userdata: Database_User | null = null;
    let body: Request_Login;
    let found: boolean = false;
    let jwtSign: string;

    try {
        body = await request.json();

        if (body.username === undefined || body.password === undefined || body.remember === undefined) {
            return formInvalid();
        }
    } catch (e) {
        return formInvalid();
    }

    for (let i = 0; i < db.data!.data.length; i++) {
        const user = db.data?.data[i];

        if (
            user!.username === body.username 
            && CryptoJS.AES.decrypt(user!.password, process.env.APP_KEY!).toString(CryptoJS.enc.Utf8) === body.password
        ) {
            userdata = db.data!.data[i];
            found = true;
            break;
        }
    }

    if (!found) {
        return responseBuilder(false, {
            message: [
                'Username atau password tidak sesuai'
            ]
        });
    }

    let cookieMaxAge = body.remember ? 'max-age=' + (60 * 60 * 30) : ''
    jwtSign = jwt.sign({
        id: userdata?.id,
    }, process.env.APP_KEY!, {
        expiresIn: '1h'
    });


    return responseBuilder(true, {}, {
        headers: {
            'Set-cookie': 'token=' + jwtSign + '; path=/; ' + cookieMaxAge
        }
    })
}