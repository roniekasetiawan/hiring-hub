import { NextRequest } from 'next/server';
import { supabase } from '@/services/supabase';
import { paginated, error, safe } from '@/server/response';

export async function GET(req: NextRequest) {
    return safe(async () => {
        const { searchParams } = new URL(req.url);
        const page  = Math.max(1, Number(searchParams.get('page') ?? 1));
        const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? 10)));
        const q     = (searchParams.get('q') ?? '').trim();

        const from = (page - 1) * limit;
        const to   = from + limit - 1;

        let query = supabase
            .from('users')
            .select('id,email,full_name,role,created_at', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to);

        if (q) query = query.or(`email.ilike.%${q}%,full_name.ilike.%${q}%`);

        const { data, error: dbErr, count } = await query;
        if (dbErr) return error({ code: dbErr.code }, 500, dbErr.message);

        return paginated(data ?? [], limit, count ?? 0);
    });
}
