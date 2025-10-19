import type { ReactNode } from "react";

export default function AdminJobsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-screen-xl px-4 py-6">{children}</main>
    </div>
  );
}
