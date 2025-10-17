import { createClient } from '@supabase/supabase-js';
import { AppConfig } from '@/configs';

export const supabase = createClient(
    AppConfig.supabase.url,
    AppConfig.supabase.anonKey,
    { auth: { persistSession: true, autoRefreshToken: true } }
);
