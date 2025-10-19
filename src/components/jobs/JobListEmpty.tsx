"use client";

import * as React from "react";

type Props = {
  onCreateJob: () => void;
};

export default function JobListEmpty({ onCreateJob }: Props) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 p-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <img
            src="/assets/images/people_looking.svg"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/300x200/F3F4F6/CCCCCC?text=Image+Not+Found";
            }}
            alt="No job openings illustration"
            className="h-48 w-auto"
          />
        </div>

        <h2 className="text-xl font-bold text-gray-800">
          No job openings available
        </h2>
        <p className="mt-2 text-base text-gray-500">
          Create a job opening now and start the candidate process.
        </p>

        <div className="mt-8">
          <button
            onClick={onCreateJob}
            className="rounded-xl hover:cursor-pointer bg-yellow-400 px-7 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2"
            data-testid="create-job-empty-cta"
          >
            Create a new job
          </button>
        </div>
      </div>
    </div>
  );
}
