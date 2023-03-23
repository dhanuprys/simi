import { Response_GeneralMessage } from '@/interface';
import middleware, { responseBuilder } from '@/libs/middleware';
import { NextRequest } from 'next/server';
import fs from 'fs';

export async function POST(request: NextRequest, { params }: { params: any }) {
    const auth = await middleware.parseToken(request);
    let image: Blob;
    
    if (!auth) return middleware.notAuthenticated();
    if (auth.access === 'readonly') return middleware.rejectReadonly();

    try {
        image = await request.blob();

        // TODO: LOGIC
    } catch (e) {
        console.log(e);
    }

    return responseBuilder<Response_GeneralMessage>(true, {
        message: [
            'Photo profile berhasil diubah'
        ]
    });
}