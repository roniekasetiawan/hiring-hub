import { NextRequest } from 'next/server';
import { supabase } from '@/services/supabase';
import { getServerUser } from '@/server/jwt';
import { error, success } from '@/server/response';

export async function GET(_req: NextRequest) {
    const user = await getServerUser();
    if (!user) return error(null, 401, 'Unauthorized');

    const { data: rows, error: dbErr } = await supabase
        .from('role_permissions')
        .select('permissions!inner(action,subject,conditions)')
        .eq('role_id', user.role);

    if (dbErr) return error({ code: dbErr.code }, 500, dbErr.message);

    const rules = (rows ?? []).map((r: any) => {
        const cond = r.permissions.conditions
            ? JSON.parse(
                JSON.stringify(r.permissions.conditions)
                    .replaceAll('"$USER_ID"', `"${user.id}"`)
            )
            : undefined;

        return { action: r.permissions.action, subject: r.permissions.subject, conditions: cond };
    });

    return success({ rules });
}
