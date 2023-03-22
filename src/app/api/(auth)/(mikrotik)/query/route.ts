import { NextRequest, NextResponse } from 'next/server';
import { Routeros } from 'routeros-node';
import Database from '@/libs/Database';
import { 
    Database_DeviceItem,
    Database_DeviceList,
    Request_Query,
    Response_GeneralData,
    Response_GeneralMessage 
} from '@/interface';
import middleware from '@/libs/middleware';

export async function POST(request: NextRequest) {
    const db = await Database.open<Database_DeviceList>('device');
    const auth = await middleware.parseToken(request);
    let body: Request_Query;
    let deviceCredential: Database_DeviceItem | null = null;
    let result: { [prop: string]: any } = {};
    let ros;
    let conn;

    if (!auth) return middleware.notAuthenticated();
    if (auth.access === 'readonly') return middleware.rejectReadonly();

    try {
        body = await request.json();

        if (body.deviceId === undefined || body.queries === undefined) {
            return middleware.formInvalid();
        } 
    } catch (e) {
        return middleware.formInvalid();
    }

    for (let i = 0; i < db.data!.data.length; i++) {
        deviceCredential = db.data!.data[i];

        if (deviceCredential.id !== body.deviceId) continue;

        break;
    }

    if (deviceCredential === null) {
        return middleware.responseBuilder<Response_GeneralMessage>(false, {
            message: [
                'Perangkat tidak ditemukan'
            ]
        });
    }

    if (deviceCredential.version === '7.x') {
        return middleware.responseBuilder<Response_GeneralMessage>(false, {
            message: [
                'Query pada versi 7 belum tersedia'
            ]
        });
    }

    ros = new Routeros({
        host: '192.168.80.1',
        user: 'admin',
        password: 'admin',
        port: 8728,
        timeout: 3
    });
    
    try {
        let conn = await ros.connect();

        for (let i: number = 0; i < body.queries.length; i++) {
            let response = await conn.write([ body.queries[i].command, ...body.queries[i].args ]);
            result[body.queries[i].label] = response.length <= 0 ? [] : response[0];
        }

        conn.destroy();
    } catch (e) {
        console.log(e);
        return NextResponse.json({
            error: 1
        });
    }

    return middleware.responseBuilder<Response_GeneralData>(true, {
        data: result
    });

    // const address = await conn.write(['/ip/address/print'])

    // conn.destroy()
}