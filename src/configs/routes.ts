import type { Role } from './app.config';

export const routes = {
    auth: {
        login: '/(auth)/login',
        register: '/(auth)/register',
    },
    dashboard: '/dashboard',
    jobs: '/jobs',
    applications: '/applications',
    admin: '/admin',
} as const;

export const routeGuards: Record<string, Role[]> = {
    [routes.dashboard]: ['admin', 'recruiter', 'applicant'],
    [routes.jobs]: ['admin', 'recruiter', 'applicant'],
    [routes.applications]: ['admin', 'recruiter', 'applicant'],
    [routes.admin]: ['admin'],
};
