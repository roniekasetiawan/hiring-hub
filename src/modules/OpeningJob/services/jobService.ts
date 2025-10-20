import { PaginatedJobsResponse } from "..//types/job";

export const fetchJobs = async (
  url: string,
): Promise<PaginatedJobsResponse> => {
  const res = await fetch(url);

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "An error occurred while fetching.");
  }

  const result = await res.json();
  console.log({ result });
  if (result.message.toLowerCase() !== "success") {
    throw new Error(result.message || "Failed to fetch data (API Error).");
  }

  return result.data;
};
