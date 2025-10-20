"use client";

import { Job } from "../types/job";
import Image from "next/image";
import { formatSnackLabels } from "@/utility/textUtils";

interface JobDetailsProps {
  job: Job | null;
}

export const JobDetails = ({ job }: JobDetailsProps) => {
  if (!job) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6">
        <p className="text-gray-500">
          Pilih lowongan di sebelah kiri untuk melihat detailnya
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 max-h-screen position-sticky">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 text-blue-600">
              <Image
                src={job.avatar ?? "/avatar-fallback.png"}
                alt={`${job?.name ?? "Avatar"}`}
                fill
                style={{ objectFit: "cover" }}
                priority={false}
              />
            </div>
            <div>
              <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                {formatSnackLabels(job.job_type)}
              </span>
              <h2 className="mt-1 text-xl font-bold text-gray-900">
                {job.title}
              </h2>
              <p className="text-sm text-gray-600">{job.name}</p>
            </div>
          </div>
          <button className="rounded-lg bg-yellow-400 font-bold px-6 py-2 text-sm text-black shadow-sm hover:bg-yellow-500 hover:cursor-pointer">
            Apply
          </button>
        </div>
      </div>

      <hr className="my-6 flex-shrink-0 border-gray-200" />

      <div className="flex-1 overflow-y-auto pr-2">
        <div className="prose prose-sm max-w-none text-gray-700">
          <p>{job.description}</p>
        </div>
      </div>
    </div>
  );
};
