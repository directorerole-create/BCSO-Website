import { NextRequest, NextResponse } from "next/server";
import { createServerClient, hashPassword, validateSession } from "@/lib/supabase-server";

async function auth(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") ?? null;
  return validateSession(token);
}

export async function GET(req: NextRequest) {
  const user = await auth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, username, display_name, role, created_at")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ users: data });
}

export async function POST(req: NextRequest) {
  const user = await auth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (user.role !== "superadmin") return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });

  const { username, displayName, role, password } = await req.json();
  if (!username || !displayName || !password) {
    return NextResponse.json({ error: "Username, display name, and password are required." }, { status: 400 });
  }

  const supabase = createServerClient();
  const pwHash = await hashPassword(password);

  const { data, error } = await supabase
    .from("admin_users")
    .insert({ username: username.trim().toLowerCase(), display_name: displayName.trim(), role: role ?? "admin", password_hash: pwHash })
    .select("id, username, display_name, role, created_at")
    .single();

  if (error) {
    const msg = error.message.includes("unique") ? "That username is already taken." : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  return NextResponse.json({ user: data });
}

export async function DELETE(req: NextRequest) {
  const user = await auth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (user.role !== "superadmin") return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });

  const { id } = await req.json();
  if (id === user.id) return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });

  const supabase = createServerClient();
  const { error } = await supabase.from("admin_users").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
