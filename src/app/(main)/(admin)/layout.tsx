import type { ReactNode } from 'react';
import Topbar from '@/components/layout/Topbar';

export default function AdminJobsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50">
            <Topbar title="Job List" />
            <main className="mx-auto max-w-screen-xl px-4 py-6">{children}</main>
        </div>
    );
}
