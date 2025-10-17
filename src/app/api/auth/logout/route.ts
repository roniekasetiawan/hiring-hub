import { success } from '@/server/response';

export async function POST() {
    const res = success({ ok: true });
    res.headers.set('Set-Cookie', 'HIRING_HUB_TOKEN=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
    return res;
}
