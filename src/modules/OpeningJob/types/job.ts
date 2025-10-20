export interface Job {
  id: string;
  title: string;
  salaryMin: number;
  salaryMax: number;
  status: "Active" | "Inactive" | "Draft";
  startDate: string;
  company_name: string;
  location: string;
  job_type: "Full-Time" | "Part-Time" | "Contract";
  description: string;
  description_points: string[];
  name: string;
  avatar?: string | null;
}

export interface PaginatedJobsResponse {
  data: Job[];
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
}
