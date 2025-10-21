import React, { FC } from "react";
import Link from "next/link";

type JobStatus = "Active" | "Inactive" | "Draft";

interface Job {
  id: number;
  title: string;
  salaryMin: number;
  salaryMax: number;
  status: JobStatus;
  startDate: string;
}

const StatusBadge: FC<{ status: JobStatus }> = ({ status }) => {
  const baseClasses = "text-xs font-medium mr-2 px-3 py-1 rounded-md";
  const statusClasses: Record<JobStatus, string> = {
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-red-100 text-red-700",
    Draft: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>
  );
};

const JobCard: FC<{ job: Job }> = ({ job }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace(/\s/g, "");
  };

  return (
    <div className="mb-4 w-full max-w-4xl rounded-xl bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex-grow">
          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <StatusBadge status={job.status} />
            <span className="text-xs border border-gray-200 text-gray-600 font-medium px-3 py-1 rounded-md">
              started on {job.startDate}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
          <p className="mt-1 text-sm text-gray-600">
            {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
          </p>
        </div>
        <div className="flex-shrink-0">
          <Link href={`/list-candidate?jobId=${job.id}`}>
            <button className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
              Manage Job
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
