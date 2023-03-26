// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    
    if (request.nextUrl.pathname.startsWith('/a/')) {
        if (token === undefined) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        return NextResponse.next();
    } else if (request.nextUrl.pathname === '/login') {
        if (token === undefined) {
            return NextResponse.next();
        }

        return NextResponse.redirect(new URL('/a/dashboard', request.url));
    } else if (request.nextUrl.pathname === '/') {
        if (token === undefined) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        return NextResponse.rewrite(new URL('/a/dashboard', request.url));
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
