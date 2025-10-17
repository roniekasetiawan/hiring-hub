import { onGet, onPost, onPatch, onDelete, type ServiceConfig } from '@/lib/http';

export type UserRole = 'admin' | 'recruiter' | 'applicant';

export type User = {
    id: string;
    email: string;
    full_name: string | null;
    role: UserRole;
    created_at: string;
};

export type PageResp<T> = { data: T[]; page: number; limit: number; total: number };
export type PageQuery = { page?: number; limit?: number; q?: string };

export const usersService = {
    list: (params?: PageQuery, cfg?: Omit<ServiceConfig<PageQuery>, 'params'>) =>
        onGet<PageQuery, PageResp<User>>('/api/users', { ...(cfg || {}), params }),

    get: (id: string, cfg?: ServiceConfig) =>
        onGet<unknown, User>(`/api/users/${id}`, cfg),

    create: (
        payload: { email: string; full_name?: string | null; role: UserRole; password?: string },
        cfg?: ServiceConfig
    ) => onPost<unknown, typeof payload, User>('/api/users', payload, { config: cfg }),

    update: (id: string, payload: Partial<Pick<User, 'full_name' | 'role'>>, cfg?: ServiceConfig) =>
        onPatch<unknown, typeof payload, User>(`/api/users/${id}`, payload, { config: cfg }),

    remove: (id: string, cfg?: ServiceConfig) =>
        onDelete<unknown, { success: true }>(`/api/users/${id}`, { config: cfg }),
};
