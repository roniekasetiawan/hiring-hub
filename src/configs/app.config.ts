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
        base?: string | undefined;
        apis?: string | undefined;
    };
    supabase: {
        url: string;
        anonKey: string;
    };
    features: FeatureFlags;
    authSecret: string;
};

export const AppConfig: AppConfig = {
    name: env.NEXT_PUBLIC_APP_NAME,
    version: (pkg as any).version ?? '0.0.0',
    urls: {
        base: env.NEXT_PUBLIC_APP_URL,
        apis: env.NEXT_PUBLIC_API_HOST,
    },
    supabase: {
        url: env.NEXT_PUBLIC_SUPABASE_URL,
        anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    features: {
        enableI18n: true,
        enableCharts: true,
        enableWebAuthn: false,
    },
    authSecret: env.JWT_AUTH_SECRET ?? 'sebuah-secret-yang-sangat-panjang-dan-rumit-sekali-du21hhd19',
} as const;
