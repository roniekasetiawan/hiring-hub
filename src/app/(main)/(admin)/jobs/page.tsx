"use client";

import * as React from "react";
import JobListEmpty from "@/components/jobs/JobListEmpty";
import JobCard from "@/components/jobs/JobList";
import JobOpeningModal from "@/components/jobs/CreateJobModal";
import { useState } from "react";
import PageID from "@/@core/components/PageID";
import useSWR from "swr";

type JobStatus = "Active" | "Inactive" | "Draft";

interface Jobs {
  id: number;
  title: string;
  salaryMin: number;
  salaryMax: number;
  status: JobStatus;
  startDate: string;
}

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((r) => r.json());

export default function JobListPage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { data, isLoading } = useSWR<{ data: Jobs[] }>("/api/jobs", fetcher);

  const jobs = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-500">Loading jobs…</div>
    );
  }

  function toggleModal() {
    setIsModalOpen((prev) => !prev);
  }

  return (
    <PageID
      title="Management Menu"
      path="/config/manage-menu"
      breadcrumbs={{
        title: "Management Menu",
        routes: [
          { label: "Konfigurasi" },
          { label: "Management Menu", href: "/config/manage-menu" },
          { label: "Detail Menu" },
        ],
      }}
    >
      <div className="flex gap-6 ">
        <div className="flex-1">
          <div className="w-full">
            <label htmlFor="search" className="sr-only">
              Search job
            </label>

            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="Search by job details"
                className="w-full rounded-lg border-gray-200 bg-white p-4 pe-12 text-sm shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />

              <span className="absolute inset-y-0 end-0 grid w-16 place-content-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5 text-teal-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </span>
            </div>
          </div>
          {!jobs.length ? (
            <JobListEmpty onCreateJob={toggleModal} />
          ) : (
            <div className="flex min-h-screen w-full flex-col font-sans mt-5">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>

        <aside className="hidden w-[350px] shrink-0 md:block">
          <div
            className="relative mx-auto max-w-xl overflow-hidden rounded-2xl bg-cover bg-center text-white shadow-lg"
            style={{
              backgroundImage: `url(/assets/images/popup_background.jpg)`,
            }}
          >
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="relative z-10 flex h-full flex-col justify-between p-8 text-left">
              <div>
                <h2 className="text-xl font-bold">
                  Recruit the best candidates
                </h2>
                <p className="mt-2 text-md text-gray-200">
                  Create jobs, invite, and hire with ease
                </p>
              </div>

              <div className="mt-8">
                <button
                  onClick={toggleModal}
                  className="rounded-lg hover:cursor-pointer w-full bg-teal-500 px-8 py-3 text-lg font-bold text-white transition hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                  data-testid="create-job-cta"
                >
                  Create a new job
                </button>
              </div>
            </div>
          </div>
        </aside>
        <JobOpeningModal isOpen={isModalOpen} onClose={toggleModal} />
      </div>
    </PageID>
  );
}
