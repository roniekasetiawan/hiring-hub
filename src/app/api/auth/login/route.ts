import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/services/supabase";
import { error, success } from "@/server/response";
import { signToken } from "@/server/jwt";

type Body = { email: string; password: string };

export async function POST(req: NextRequest) {
  const { email: rawEmail, password } = (await req.json()) as Body;
  const email = (rawEmail || "").trim().toLowerCase();
  if (!email || !password)
    return error(null, 400, "Email & password are required");

  const { data: user, error: dbErr } = await supabase
    .from("users")
    .select("id,email,full_name,role,password_hash")
    .eq("email", email)
    .maybeSingle();

  if (dbErr) return error({ code: dbErr.code }, 500, dbErr.message);
  if (!user) return error(null, 401, "Invalid credentials");

  const ok = await bcrypt.compare(password, user.password_hash || "");
  if (!ok) return error(null, 401, "Invalid credentials");

  const token = await signToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    full_name: user.full_name,
  });

  const res = success({
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
    },
  });
  res.headers.set(
    "Set-Cookie",
    `HIRING_HUB_TOKEN=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,
  );
  return res;
}
