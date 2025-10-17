import { onPost } from '@/lib/http';

export type AuthUser = {
    id: string; email: string; full_name: string | null;
    role: 'admin' | 'recruiter' | 'applicant';
};

export const authService = {
    login:  (email: string, password: string) =>
        onPost<unknown, { email: string; password: string }, { user: AuthUser }>(
            '/api/auth/login', { email, password }
        ).then(r => r.data),

    signup: (email: string, password: string, full_name?: string | null) =>
        onPost<unknown, { email: string; password: string; full_name?: string | null }, { user: AuthUser }>(
            '/api/auth/signup', { email, password, full_name }
        ).then(r => r.data),

    logout: () => onPost('/api/auth/logout', {}),
};
