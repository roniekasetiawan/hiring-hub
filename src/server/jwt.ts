import { SignJWT, jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_AUTH_SECRET || 'dev-secret-change-me');

export type JwtPayload = { sub: string; email: string; role: 'admin'|'recruiter'|'applicant' };

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
