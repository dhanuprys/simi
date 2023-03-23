import middleware from '@/libs/middleware';
import { type NextRequest } from 'next/server';
import logging from '@/libs/Logging';
import { Database_Log, Response_GeneralData } from '@/interface';

export async function GET(request: NextRequest) {
    // const auth = await middleware.parseToken(request);

    // if (!auth) return middleware.notAuthenticated();
    // if (auth.access === 'readonly') return middleware.rejectReadonly();

    return middleware.responseBuilder<Response_GeneralData<Database_Log[]>>(true, {
        data: await logging.read()
    });
}