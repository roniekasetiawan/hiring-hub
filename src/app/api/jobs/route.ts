import { NextRequest } from "next/server";
import { error, success, safe } from "@/server/response";
import { buildJobPayload } from "@/app/(main)/(admin)/jobs/helper";
import { getServerUser } from "@/server/jwt";
import { supabase } from "@/services/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return safe(async () => {
    const user = await getServerUser();

    console.log("USER FROM JWT:", user);

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
