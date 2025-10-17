import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {verifyToken} from "@/server/jwt";

const PUBLIC = ['/login', '/register', '/api', '/_next', '/favicon.ico', '/images', '/assets'];
const SECRET = new TextEncoder().encode(process.env.JWT_AUTH_SECRET || '');

async function isValid(token?: string) {
    if (!token || !SECRET.length) return false
    try {
        const isValid = await verifyToken(token);
        if (!isValid) {
            return false;
        }
        return true;
    } catch (err) {
        return false;
    }
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const isPublic = PUBLIC.some(p => pathname === p || pathname.startsWith(p + '/'));
    if (isPublic) return NextResponse.next();

    const token = req.cookies.get('HIRING_HUB_TOKEN')?.value;
    const ok = await isValid(token);

    if (!ok) {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('next', pathname);
        return NextResponse.redirect(url);
    }

    if (pathname === '/login' || pathname === '/register') {
        const url = req.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|images|assets).*)'],
};
