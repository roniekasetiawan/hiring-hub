import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/services/supabase";
import { error, success } from "@/server/response";
import { signToken } from "@/server/jwt";

type Body = {
  email: string;
  password: string;
  full_name?: string;
  user_type?: "admin" | "recruiter" | "applicant";
};

export async function POST(req: NextRequest) {
  const {
    email: rawEmail,
    password,
    full_name,
    user_type: role,
  } = (await req.json()) as Body;
  const email = (rawEmail || "").trim().toLowerCase();

  if (!email || !password)
    return error(null, 400, "Email & password are required");
  if (password.length < 6)
    return error(null, 422, "Password must be at least 6 characters");

  const { data: exists, error: findErr } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (findErr) return error({ code: findErr.code }, 500, findErr.message);
  if (exists) return error(null, 409, "User already registered");

  const password_hash = await bcrypt.hash(password, 10);

  const { data, error: insErr } = await supabase
    .from("users")
    .insert({ email, full_name: full_name ?? null, role, password_hash })
    .select("id,email,full_name,role")
    .single();

  if (insErr) return error({ code: insErr.code }, 500, insErr.message);

  const token = await signToken({
    sub: data.id,
    email: data.email,
    role: data.role,
    full_name: data.full_name,
  });
  const res = success({ user: data });
  res.headers.set(
    "Set-Cookie",
    `HIRING_HUB_TOKEN=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,
  );
  return res;
}
