// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    
    if (request.nextUrl.pathname === '/dashboard') {
        if (token === undefined) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        return NextResponse.next();
    }

    // if (request.nextUrl.pathname === '/') {
    //     return NextResponse.rewrite(new URL('/dashboard', request.url));
    // }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
// export const config = {
//     matcher: [
//         '/((?!api|_next/static|_next/image|favicon.ico).*)',
//         '/auth/login'
//     ],
// }
