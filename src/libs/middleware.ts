import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import process from 'process'

export function isAuthenticate(request: NextRequest): false | string | jwt.JwtPayload {
    const token = request.cookies.get('token')?.value;
    let credential;

    try {
        credential = jwt.verify(token!, process.env.APP_KEY!);
    } catch (e) {
        return false;
    }

    

    return credential;
}

export function notAuthenticated() {
    return NextResponse.json({
        error: 1
    });
}

export function responseBuilder<T = any>(success: boolean, data: T, init?: ResponseInit) {
    return NextResponse.json({
        success,
        data
    }, init);
}

export function formInvalid() {
    return responseBuilder(false, null);
}