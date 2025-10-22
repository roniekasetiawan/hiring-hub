import { NextRequest } from "next/server";
import { error, success, safe } from "@/server/response";
import { supabase } from "@/services/supabase";

export const dynamic = "force-dynamic";

type JobStatus = "Active" | "Inactive" | "Draft";

interface FrontendJob {
  id: string;
  title: string;
  salaryMin: number;
  salaryMax: number;
  description: string;
  status: JobStatus;
  job_type: string;
  startDate: string;
  avatar?: string | null;
  name: string;
  applications_config: string;
}

export async function GET(req: NextRequest) {
  return safe(async () => {
    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
      return error(null, 400, "Invalid page or limit parameters.");
    }

    const offset = (page - 1) * limit;
    const to = offset + limit - 1;

    let query = supabase
      .from("jobs")
      .select("*, users(full_name, avatar)", { count: "exact" })
      .in("status", ["active", "draft", "inactive"])
      .order("created_at", { ascending: false })
      .range(offset, to);

    const { data: jobsFromDb, error: dbErr, count } = await query;

    if (dbErr) {
      return error(
        { code: dbErr.code },
        500,
        `Failed to fetch jobs: ${dbErr.message}`,
      );
    }

    const transformedJobs: FrontendJob[] = (jobsFromDb || []).map((job) => {
      const capitalizedStatus = (job.status.charAt(0).toUpperCase() +
        job.status.slice(1)) as JobStatus;

      const formattedDate = new Date(job.created_at).toLocaleDateString(
        "en-GB",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        },
      );

      return {
        id: job.id,
        title: job.title,
        salaryMin: job.salary_min ?? 0,
        salaryMax: job.salary_max ?? 0,
        description: job.description,
        job_type: job.job_type,
        status: capitalizedStatus,
        startDate: formattedDate,
        name: job.users.full_name,
        avatar: job.users.avatar ?? "",
        applications_config: job.application_form_config,
      };
    });

    const hasNextPage = offset + limit < (count || 0);

    return success({
      data: transformedJobs,
      page: page,
      limit: limit,
      total: count,
      hasNextPage: hasNextPage,
    });
  });
}
