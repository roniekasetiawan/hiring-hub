"use client";

import { Job } from "../types/job";
import { useInfiniteScroll } from "..//hooks/useInfiniteScroll";
import { JobCard } from "./JobCard";
import { Loader2 } from "lucide-react";

interface JobListProps {
  jobs: Job[];
  selectedJobId: string | null;
  onSelectJob: (id: string) => void;
  isLoading: boolean;
  hasNextPage?: boolean;
  loadMoreJobs: () => void;
}

export const JobList = ({
  jobs,
  selectedJobId,
  onSelectJob,
  isLoading,
  hasNextPage,
  loadMoreJobs,
}: JobListProps) => {
  const { lastElementRef } = useInfiniteScroll({
    isLoading,
    hasNextPage,
    onLoadMore: loadMoreJobs,
  });

  return (
    <div className="h-full space-y-4 overflow-y-auto rounded-lg border p-4 max-h-screen overflow-scroll pb-[200px]">
      {jobs.map((job, index) => (
        <JobCard
          key={index + job.id}
          job={job}
          isSelected={job.id === selectedJobId}
          onClick={() => onSelectJob(job.id)}
        />
      ))}

      <div ref={lastElementRef} className="h-2 w-full" />

      {isLoading && jobs.length > 0 && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Memuat...</span>
        </div>
      )}

      {!hasNextPage && !isLoading && jobs.length > 0 && (
        <div className="py-4 text-center text-sm text-gray-500">
          -- Anda telah mencapai akhir --
        </div>
      )}

      {jobs.length === 0 && !isLoading && (
        <div className="py-4 text-center text-sm text-gray-500">
          Tidak ada lowongan ditemukan.
        </div>
      )}
    </div>
  );
};
