import { NextRequest } from 'next/server';
import Database from '@/libs/Database';
import middleware, { formInvalid, responseBuilder } from '@/libs/middleware';
import { 
    Database_DeviceItem, 
    Database_DeviceList, 
    Request_AddDevice, 
    Request_DeleteDevice, 
    Request_UpdateDevice,
    Response_GeneralData,
    Response_GeneralMessage
} from '@/interface';
import { nanoid } from 'nanoid';

export async function GET(request: NextRequest) {
    const db = await Database.open<Database_DeviceList>('device');

    return middleware.responseBuilder<Response_GeneralData<Database_DeviceItem[]>>(true, {
        data: db.data!.data
    });
}

export async function POST(request: NextRequest) {
    const db = await Database.open<Database_DeviceList>('device');
    const auth = await middleware.parseToken(request);
    let body: Request_AddDevice;

    if (!auth) return middleware.notAuthenticated();
    if (auth.access === 'readonly') return middleware.rejectReadonly();

    try {
        body = await request.json();

        if (
            body.name === undefined
            || body.description === undefined
            || body.hostname === undefined
            || body.username === undefined 
            || body.password === undefined 
            || body.version === undefined
            || body.port === undefined
        ) {
            return middleware.formInvalid();
        }
    } catch (e) {
        return middleware.formInvalid();
    }

    if (!['6.34.x+', '7.x'].includes(body.version)) {
        return responseBuilder(false, {
            message: [
                'Versi RouterOS tidak valid'
            ]
        });
    }

    db.data?.data.push({
        id: nanoid(),
        name: body.name,
        description: body.description,
        hostname: body.hostname,
        username: body.username,
        password: body.password,
        port: body.port,
        version: body.version,
        created_at: new Date,
        updated_at: new Date
    });

    try {
        await db.write();
    } catch (e) {
        return responseBuilder<Response_GeneralMessage>(false, {
            message: [
                'Gagal memperbarui perangkat'
            ]
        });
    }
    
    return responseBuilder<Response_GeneralMessage>(true, {
        message: [
            'Berhasil menambahkan perangkat'
        ]
    });
}

export async function PUT(request: NextRequest) {
    const db = await Database.open<Database_DeviceList>('device');
    const auth = await middleware.parseToken(request);
    let body: Request_UpdateDevice;

    if (!auth) return middleware.notAuthenticated();
    if (auth.access === 'readonly') return middleware.rejectReadonly();

    try {
        body = await request.json();

        if (
            body.id === undefined
            || body.name === undefined
            || body.username === undefined
            || body.username === undefined 
            || body.password === undefined 
            || body.port === undefined
            || body.version === undefined
        ) {
            return middleware.formInvalid();
        }
    } catch (e) {
        return middleware.formInvalid();
    }

    if (!['6.34.x+', '7.x'].includes(body.version)) {
        return responseBuilder<Response_GeneralMessage>(false, {
            message: [
                'Versi RouterOS tidak valid'
            ]
        });
    }

    for (let i: number = 0; i < db.data!.data.length; i++) {
        const current = db.data!.data[i];
        if (current.id !== body.id) continue;

        db.data!.data[i] = {
            id: body.id,
            name: body.name || current.name,
            description: body.description || current.description,
            hostname: body.hostname || current.hostname,
            username: body.username || current.username,
            password: body.password || current.password,
            port: body.port || current.port,
            version: body.version || current.version,
            created_at: current.created_at,
            updated_at: new Date
        };
    }

    try {
        await db.write();
    } catch (e) {
        return responseBuilder<Response_GeneralMessage>(false, {
            message: [
                'Gagal memperbarui perangkat'
            ]
        });
    }
    
    return responseBuilder<Response_GeneralMessage>(true, {
        message: [
            'Berhasil memperbarui perangkat'
        ]
    });
}

export async function DELETE(request: NextRequest) {
    const db = await Database.open<Database_DeviceList>('device');
    const auth = await middleware.parseToken(request);
    let body: Request_DeleteDevice;
    let result: Database_DeviceItem[] = [];

    if (!auth) return middleware.notAuthenticated();
    if (auth.access !== 'full') return middleware.onlyFullAccess();

    try {
        body = await request.json();

        console.log(body);

        if (body.id === undefined) {
            return formInvalid();
        }
    } catch (e) {
        return formInvalid();
    }

    for (let i: number = 0; i < db.data!.data.length; i++) {
        if (db.data!.data[i].id === body.id) continue;

        result.push(db.data!.data[i]);
    }

    db.data!.data = result;

    try {
        await db.write();
    } catch (e) {
        return responseBuilder<Response_GeneralMessage>(false, {
            message: [
                'Gagal menghapus perangkat'
            ]
        });
    }

    return responseBuilder<Response_GeneralMessage>(true, {
        message: [
            'Berhasil menghapus perangkat'
        ]
    });
}