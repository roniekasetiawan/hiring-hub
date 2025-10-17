import type { Role } from '@/configs';

export type MenuItem = {
    id: string;
    label: string;
    href: string;
    icon?: string;
    permission?: string;
    children?: MenuItem[];
};

export const defaultMenusFor = (role: Role): MenuItem[] => {
    const base: MenuItem[] = [
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard', permission: 'dashboard.read' },
        { id: 'jobs', label: 'Jobs', href: '/jobs', permission: 'job.read' },
    ];

    if (role === 'recruiter' || role === 'admin') {
        base.push(
            { id: 'create-job', label: 'Create Job', href: '/jobs/new', permission: 'job.create' },
            { id: 'applications', label: 'Applications', href: '/applications', permission: 'application.read' }
        );
    }

    if (role === 'admin') {
        base.push({ id: 'users', label: 'Users', href: '/users', permission: 'user.read' });
    }

    return base;
};
