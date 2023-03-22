import { Response_Blank } from '@/interface';
import { responseBuilder } from '@/libs/middleware';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    return responseBuilder<Response_Blank>(true, {}, {
        headers: {
            'Set-cookie': 'token=; max-age=0; path=/'
        }
    });
}