export interface SupabaseJobInsert {
  title: string;
  job_type: "full_time" | "part_time" | "contract" | "internship" | "freelance";
  description: string;
  candidates_needed: number;
  salary_min?: number;
  salary_max?: number;
  application_form_config: Record<string, "Mandatory" | "Optional" | "Off">;
  status: "draft" | "active" | "inactive";
  created_by_user_id: string;
}

const jobTypeMap: Record<string, SupabaseJobInsert["job_type"]> = {
  "Full-time": "full_time",
  "Part-time": "part_time",
  Contract: "contract",
  Internship: "internship",
  Freelance: "freelance",
};

export function buildJobPayload(
  formData: any,
  userId: string,
): SupabaseJobInsert {
  const statusMap: Record<number, SupabaseJobInsert["status"]> = {
    1: "active",
    2: "inactive",
    3: "draft",
  };

  const randomNumber = Math.floor(Math.random() * 3) + 1;
  const randomStatus = statusMap[randomNumber];

  return {
    title: formData.jobName,
    job_type: jobTypeMap[formData.jobType],
    description: formData.jobDescription,
    candidates_needed: formData.numCandidates,
    salary_min: formData.minSalary
      ? parseFloat(formData.minSalary.replace(/[^0-9]/g, ""))
      : undefined,
    salary_max: formData.maxSalary
      ? parseFloat(formData.maxSalary.replace(/[^0-9]/g, ""))
      : undefined,
    application_form_config: formData.requirements,
    status: randomStatus,
    created_by_user_id: userId,
  };
}
