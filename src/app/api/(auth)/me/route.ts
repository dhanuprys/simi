import { type NextRequest } from 'next/server';
import Database from '@/libs/Database';
import { Database_User, Database_UserList, FallbackCode, Response_Blank, Response_GeneralData } from '@/interface';
import middleware from '@/libs/middleware';

export async function GET(request: NextRequest) {
    const db = await Database.open<Database_UserList>('user');
    const auth = await middleware.parseToken(request);

    if (!auth) return middleware.notAuthenticated();

    for (let i = 0; i < db.data!.data.length; i++) {
        if (db.data!.data[i].id === auth.id) {
            let dump = db.data!.data[i];
            dump.password = '';
            
            return middleware.responseBuilder<Response_GeneralData<Database_User>>(true, {
                data: dump
            }, FallbackCode.AUTHENTICATED);
        }
    }

    return middleware.responseBuilder<Response_Blank>(true, {}, FallbackCode.NOT_AUTHENTICATED, {
        headers: {
            'Set-cookie': 'token=; max-age=0; path=/'
        }
    });
}

export async function POST() {}