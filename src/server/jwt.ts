'use server';

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(process.env.JWT_AUTH_SECRET || 'dev-secret-change-me');

export type JwtPayload = { sub: string; email: string; role: 'admin'|'recruiter'|'applicant' };

export type ServerUser = {
    id: string;
    email?: string;
    role?: 'admin' | 'recruiter' | 'applicant';
};

export async function getServerUser(): Promise<ServerUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('HIRING_HUB_TOKEN')?.value;
    if (!token || !SECRET.length) return null;

    try {
        const { payload } = await jwtVerify(token, SECRET);
        return {
            id: String(payload.sub),
            email: payload.email as string | undefined,
            role: payload.role as ServerUser['role'],
        };
    } catch {
        return null;
    }
}

export async function signToken(payload: JwtPayload, maxAge: string = '7d') {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(maxAge)
        .sign(SECRET);
}

export async function verifyToken<T = JwtPayload>(token: string) {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as T;
}
