"use client";

import { Job } from "../types/job";
import { MapPin, Briefcase, Database } from "lucide-react";
import Image from "next/image";

interface JobCardProps {
  job: Job;
  isSelected: boolean;
  onClick: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const JobCard = ({ job, isSelected, onClick }: JobCardProps) => {
  const salaryRange = `${formatCurrency(job.salaryMin)} - ${formatCurrency(
    job.salaryMax,
  )}`;

  return (
    <div
      onClick={onClick}
      className={`w-full cursor-pointer rounded-lg border  p-4 transition-all
        ${
          isSelected
            ? "border-2 border-green-600 bg-green-50 shadow-md "
            : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
        }`}
    >
      <div className="flex items-center gap-4">
        <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-md text-blue-600">
          <Image
            src={job.avatar ?? "/avatar-fallback.png"}
            alt={`${job?.name ?? "Avatar"}`}
            fill
            style={{ objectFit: "cover" }}
            priority={false}
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-600">{job.name}</p>
        </div>
      </div>

      <hr className="my-3 border-gray-100" />

      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gray-500" />
          <span>Jakarta</span>
        </div>
        <div className="flex items-center gap-2">
          <Database size={16} className="text-gray-500" />
          <span>{salaryRange}</span>
        </div>
      </div>
    </div>
  );
};
