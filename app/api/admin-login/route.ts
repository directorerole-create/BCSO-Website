import { NextRequest, NextResponse } from "next/server";
import { createServerClient, hashPassword, generateToken } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ ok: false, error: "Missing credentials." }, { status: 400 });
  }

  const supabase = createServerClient();
  const pwHash = await hashPassword(password);

  const { data: user, error } = await supabase
    .from("admin_users")
    .select("id, username, display_name, role")
    .eq("username", username.trim().toLowerCase())
    .eq("password_hash", pwHash)
    .single();

  if (error || !user) {
    return NextResponse.json({ ok: false, error: "Invalid username or password." }, { status: 401 });
  }

  // Create session (24h expiry)
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  await supabase.from("admin_sessions").insert({ token, admin_user_id: user.id, expires_at: expiresAt });

  return NextResponse.json({
    ok: true,
    token,
    user: { username: user.username, displayName: user.display_name, role: user.role },
  });
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (token) {
    const supabase = createServerClient();
    await supabase.from("admin_sessions").delete().eq("token", token);
  }
  return NextResponse.json({ ok: true });
}
