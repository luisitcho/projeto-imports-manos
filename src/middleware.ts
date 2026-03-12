import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const authCookie = request.cookies.get('admin_auth');
    const isAuth = authCookie?.value === 'true';
    const isDashboardPage = request.nextUrl.pathname.startsWith('/admin/dashboard');
    const isLoginPage = request.nextUrl.pathname === '/admin';

    if (isDashboardPage && !isAuth) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    if (isLoginPage && isAuth) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
