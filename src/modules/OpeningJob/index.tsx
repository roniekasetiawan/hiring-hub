"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { PaginatedJobsResponse, Job } from "./types/job";
import { JobDetails } from "./components/JobDetails";
import { JobList } from "./components/JobList";
import { fetchJobs } from "./services/jobService";

export default function OpeningJob() {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadMoreJobs = useCallback(async () => {
    if (isLoading || !hasNextPage) return;

    setIsLoading(true);
    setError(null);

    try {
      const url = `/api/opening-jobs?page=${page}&limit=5`;

      const response: PaginatedJobsResponse = await fetchJobs(url);

      setJobs((prevJobs) => [...prevJobs, ...response.data]);

      setHasNextPage(response.hasNextPage);
      setPage((prevPage) => prevPage + 1);
    } catch (err: any) {
      console.error("Failed to fetch jobs:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasNextPage]);

  useEffect(() => {
    if (jobs.length === 0) {
      loadMoreJobs();
    }
  }, []);

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null;

  if (!selectedJobId && jobs.length > 0) {
    setSelectedJobId(jobs[0].id);
  }

  if (isLoading && jobs.length === 0) {
    return (
      <div className="flex h-96 w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-lg text-gray-700">Loading jobs...</span>
      </div>
    );
  }

  if (error && jobs.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-red-300 bg-red-50 text-red-700">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="grid h-full w-full grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
      <div className="h-full md:col-span-1 lg:col-span-1 pb-20">
        <JobList
          jobs={jobs}
          selectedJobId={selectedJobId}
          onSelectJob={setSelectedJobId}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          loadMoreJobs={loadMoreJobs}
        />
      </div>

      <div className="hidden h-full md:col-span-2 md:block lg:col-span-3">
        <JobDetails job={selectedJob} />
      </div>
    </div>
  );
}
