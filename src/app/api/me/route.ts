import { NextRequest } from 'next/server';
import { getServerUser } from '@/server/jwt';
import { success, error } from '@/server/response';

export async function GET(_req: NextRequest) {
    const user = await getServerUser();
    if (!user) return error(null, 401, 'Unauthorized');
    return success({ user });
}
