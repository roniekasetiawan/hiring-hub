import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const formData = await req.formData();

  try {
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const linkedin = formData.get("linkedin") as string;
    const jobId = formData.get("jobId") as string;

    const dobString = formData.get("dateOfBirth") as string;
    const domicileObj = JSON.parse(formData.get("domicile") as string);
    const phoneObj = JSON.parse(formData.get("phoneNumber") as string);
    const pronoun = formData.get("pronoun") as string;

    const photoFile = formData.get("photoProfile") as File | null;

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
      email: email,
      linkedin_url: linkedin,
      photo_profile_url: photoUrl,
      date_of_birth: new Date(dobString).toISOString().split("T")[0],
      domicile: domicileObj.label,
      phone_number: `${phoneObj.country.dial}${phoneObj.national}`,
      gender: pronoun === "male" ? "Male" : "Female",
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
