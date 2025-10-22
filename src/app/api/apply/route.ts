import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function safeJsonParse<T>(val: FormDataEntryValue | null): T | null {
  if (!val) return null;
  const s = String(val);
  if (!s.trim()) return null;
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const formData = await req.formData();

  try {
    const fullName = (formData.get("fullName") as string) || "";
    const email = (formData.get("email") as string) || "";
    const linkedin = (formData.get("linkedin") as string) || "";
    const jobId = (formData.get("jobId") as string) || "";
    const dobString = (formData.get("dateOfBirth") as string) || "";
    const pronoun = (formData.get("pronoun") as string) || "";
    const photoFile = formData.get("photoProfile") as File | null;

    const domicileObj = safeJsonParse<{ value: string; label: string }>(
      formData.get("domicile"),
    );
    const phoneObj = safeJsonParse<{ country: any; national: string }>(
      formData.get("phoneNumber"),
    );

    let photoUrl = photoFile?.name ?? "";

    // if (photoFile && photoFile.size > 0) {
    //   const filePath = `public/${Date.now()}-${photoFile.name}`;
    //
    //   const { error: uploadError } = await supabase.storage
    //     .from("avatars")
    //     .upload(filePath, photoFile);
    //
    //   if (uploadError) {
    //     throw new Error(`Failed to upload photo: ${uploadError.message}`);
    //   }
    //
    //   const { data: urlData } = supabase.storage
    //     .from("avatars")
    //     .getPublicUrl(filePath);
    //
    //   photoUrl = urlData.publicUrl;
    // }

    const newApplication = {
      job_id: jobId,
      full_name: fullName,
      email,
      linkedin_url: linkedin,
      photo_profile_url: photoUrl,
      date_of_birth: dobString
        ? new Date(dobString).toISOString().split("T")[0]
        : null,
      domicile: domicileObj?.label ?? null,
      phone_number: phoneObj
        ? `${phoneObj.country?.dial ?? ""}${phoneObj.national ?? ""}`
        : null,
      gender:
        pronoun === "male" ? "Male" : pronoun === "female" ? "Female" : null,
    };

    const { error: dbError } = await supabase
      .from("job_applications")
      .insert([newApplication]);

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    return NextResponse.json({ message: "Application submitted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
