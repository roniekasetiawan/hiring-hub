import { env } from './env';
import pkg from '../../package.json';

export type Role = 'admin' | 'recruiter' | 'applicant';

export type FeatureFlags = {
    enableI18n: boolean;
    enableCharts: boolean;
    enableWebAuthn: boolean;
};

export type AppConfig = {
    name: string;
    version: string;
    urls: {
        base: string | undefined;
    };
    supabase: {
        url: string;
        anonKey: string;
    };
    features: FeatureFlags;
};

export const AppConfig: AppConfig = {
    name: env.NEXT_PUBLIC_APP_NAME,
    version: (pkg as any).version ?? '0.0.0',
    urls: { base: env.NEXT_PUBLIC_APP_URL },
    supabase: {
        url: env.NEXT_PUBLIC_SUPABASE_URL,
        anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    features: {
        enableI18n: true,
        enableCharts: true,
        enableWebAuthn: false,
    },
} as const;
