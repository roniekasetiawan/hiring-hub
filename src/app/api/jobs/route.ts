import { NextRequest } from "next/server";
import { error, success, safe } from "@/server/response";
import { buildJobPayload } from "@/app/(main)/(admin)/jobs/helper";
import { getServerUser } from "@/server/jwt";
import { supabase } from "@/services/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return safe(async () => {
    const user = await getServerUser();

    if (!user || !user.id || !user.role) {
      return error(null, 401, "You must be logged in to create a job.");
    }

    if (!["admin", "recruiter"].includes(user.role)) {
      return error(null, 403, "You do not have permission to create jobs.");
    }

    const body = await req.json();

    const jobPayload = buildJobPayload(body, user.id);

    const { data: newJob, error: dbErr } = await supabase
      .from("jobs")
      .insert(jobPayload)
      .select()
      .single();

    if (dbErr) {
      return error({ code: dbErr.code }, 500, dbErr.message);
    }

    return success(newJob, 201, "Job opening created successfully.");
  });
}

type JobStatus = "Active" | "Inactive" | "Draft";
interface FrontendJob {
  id: string;
  title: string;
  salaryMin: number;
  salaryMax: number;
  status: JobStatus;
  startDate: string;
}

export async function GET(req: NextRequest) {
  return safe(async () => {
    const user = await getServerUser();

    const { searchParams } = req.nextUrl;
    const title = searchParams.get("title");

    let query = supabase.from("jobs").select("*");

    if (user && ["admin", "recruiter"].includes(user.role as string)) {
      query = query.eq("created_by_user_id", user.id);
    } else {
      query = query.eq("status", "active");
    }

    if (title) {
      query = query.ilike("title", `%${title}%`);
    }

    const { data: jobsFromDb, error: dbErr } = await query.order("created_at", {
      ascending: false,
    });

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
        status: capitalizedStatus,
        startDate: formattedDate,
      };
    });

    return success(transformedJobs);
  });
}
