import { NextRequest, NextResponse } from 'next/server';
import { Routeros, RouterosException } from 'routeros-node';
import Database from '@/libs/Database';
import { 
    Database_DeviceItem,
    Database_DeviceList,
    FallbackCode,
    Request_Query,
    Response_GeneralData,
    Response_GeneralMessage 
} from '@/interface';
import log from '@/libs/Logging';
import middleware, { responseBuilder } from '@/libs/middleware';

export async function POST(request: NextRequest) {
    const db = await Database.open<Database_DeviceList>('device');
    const auth = await middleware.parseToken(request);
    let body: Request_Query;
    let deviceCredential: Database_DeviceItem | null = null;
    let result: { [prop: string]: any } = {};
    let ros;

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
        if (db.data!.data[i].id !== body.deviceId) continue;
        deviceCredential = db.data!.data[i];
        break;
    }

    if (deviceCredential === null) {
        return middleware.responseBuilder<Response_GeneralMessage>(false, {
            message: [
                'Perangkat tidak ditemukan'
            ]
        }, FallbackCode.DEVICE_NOT_FOUND);
    }

    if (deviceCredential.version === '7.x') {
        return middleware.responseBuilder<Response_GeneralMessage>(false, {
            message: [
                'Query pada versi 7 belum tersedia'
            ]
        });
    }

    ros = new Routeros({
        host: deviceCredential.hostname,
        user: deviceCredential.username,
        password: deviceCredential.password,
        port: Number(deviceCredential.port)
    });
    
    try {
        let conn = await ros.connect();

        for (let i: number = 0; i < body.queries.length; i++) {
            let response = await conn.write([ body.queries[i].command, ...body.queries[i].args ]);
            result[body.queries[i].label] = response.length <= 0 ? [] : body.queries[i].bypass ? response : response[0];
        }

        conn.destroy();
    } catch (e) {
        return responseBuilder<Response_GeneralMessage>(false, {
            message: ['Router tidak dapat dihubungi']
        }, FallbackCode.DEVICE_NOT_REACHABLE);
    }

    log.add('info', `Query requested`);

    return middleware.responseBuilder<Response_GeneralData>(true, {
        data: result
    });

    // const address = await conn.write(['/ip/address/print'])

    // conn.destroy()
}