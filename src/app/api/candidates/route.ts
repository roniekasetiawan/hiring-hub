import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { error, paginated, safe } from "@/server/response";

export interface FrontendCandidate {
  id: string;
  namaLengkap: string;
  emailAddress: string;
  phoneNumbers: string;
  dateOfBirth: string;
  domicile: string;
  gender: "Male" | "Female";
  linkLinkedin: string;
}

export async function GET(req: NextRequest) {
  return safe(async () => {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = req.nextUrl;

    const jobId = searchParams.get("job_id");
    if (!jobId) {
      return error(null, 400, "job_id is required");
    }

    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit") ?? 10)),
    );
    const q = (searchParams.get("q") ?? "").trim();
    const sortKey = searchParams.get("sort");
    const sortOrder = searchParams.get("order");

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const columnMap: Record<string, string> = {
      namaLengkap: "full_name",
      emailAddress: "email",
      phoneNumbers: "phone_number",
      dateOfBirth: "date_of_birth",
      domicile: "domicile",
      gender: "gender",
      linkLinkedin: "linkedin_url",
    };

    const dbSortColumn = sortKey ? columnMap[sortKey] : "created_at";
    const isAscending = sortOrder === "ascending";

    let query = supabase
      .from("job_applications")
      .select("*", { count: "exact" })
      .eq("job_id", jobId)
      .order(dbSortColumn || "created_at", { ascending: isAscending })
      .range(from, to);

    if (q) {
      query = query.or(
        `full_name.ilike.%${q}%,email.ilike.%${q}%,domicile.ilike.%${q}%`,
      );
    }

    const { data: applications, error: dbErr, count } = await query;

    if (dbErr) {
      return error({ code: dbErr.code }, 500, dbErr.message);
    }

    const formattedCandidates: FrontendCandidate[] = (applications || []).map(
      (app) => ({
        id: app.id,
        namaLengkap: app.full_name,
        emailAddress: app.email,
        phoneNumbers: app.phone_number,
        dateOfBirth: new Date(app.date_of_birth).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        domicile: app.domicile,
        gender: app.gender as "Male" | "Female",
        linkLinkedin: app.linkedin_url,
      }),
    );

    return paginated(formattedCandidates, limit, count ?? 0);
  });
}
