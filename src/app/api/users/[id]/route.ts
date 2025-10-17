import { supabase } from '@/services/supabase';
import { success, error, safe } from '@/server/response';

export async function GET(_: Request, { params }: { params: { id: string } }) {
    return safe(async () => {
        const { data, error: dbErr } = await supabase
            .from('users')
            .select('id,email,full_name,role,created_at')
            .eq('id', params.id)
            .single();

        if (dbErr?.code === 'PGRST116') return error(null, 404, 'User not found');
        if (dbErr) return error({ code: dbErr.code }, 500, dbErr.message);

        return success(data);
    });
}
