import { createClient } from "@supabase/supabase-js";

export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

export function generateToken(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function validateSession(token: string | null) {
  if (!token) return null;
  const supabase = createServerClient();
  const { data } = await supabase
    .from("admin_sessions")
    .select("admin_user_id, expires_at, admin_users(id, username, display_name, role)")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .single();
  if (!data) return null;
  return (data as any).admin_users as { id: string; username: string; display_name: string; role: string } | null;
}
