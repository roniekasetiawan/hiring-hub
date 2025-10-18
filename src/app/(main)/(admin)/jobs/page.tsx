"use client";

import * as React from "react";
import useSWR from "swr";
import JobListEmpty from "@/components/jobs/JobListEmpty";
import CreateJobModal from "@/components/jobs/CreateJobModal";

type Job = {
  id: string;
  title: string;
  status: "active" | "inactive" | "draft";
  salary_range?: { display_text?: string };
};

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((r) => r.json());

export default function JobListPage() {
  // const { data, isLoading } = useSWR<{ data: Job[] }>('/api/jobs?scope=admin', fetcher);
  const data = {
    data: [],
  };
  const isLoading = false;
  const [openCreate, setOpenCreate] = React.useState(false);

  const jobs = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-500">Loading jobs…</div>
    );
  }

  const handleCreate = () => setOpenCreate(true);

  if (!jobs.length) {
    return (
      <>
        <JobListEmpty onCreateJob={handleCreate} />
        <CreateJobModal
          open={openCreate}
          onClose={() => setOpenCreate(false)}
        />
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search by job details"
          className="w-full rounded-lg border px-4 py-2 pr-12 outline-none focus:ring-2 focus:ring-slate-300"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          🔍
        </span>
      </div>

      <ul className="space-y-3">
        {jobs.map((job) => (
          <li key={job.id} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-1 text-sm">
                  <span
                    className={`mr-2 rounded-full px-2 py-0.5 text-xs capitalize
                    ${
                      job.status === "active"
                        ? "bg-green-100 text-green-700"
                        : job.status === "inactive"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
                <h3 className="text-base font-semibold">{job.title}</h3>
                <p className="text-sm text-slate-500">
                  {job.salary_range?.display_text ?? "—"}
                </p>
              </div>
              <button className="rounded-full bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
                Manage Job
              </button>
            </div>
          </li>
        ))}
      </ul>

      <CreateJobModal open={openCreate} onClose={() => setOpenCreate(false)} />
    </div>
  );
}
