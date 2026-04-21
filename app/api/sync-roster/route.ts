import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.secret !== process.env.SYNC_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rows = body.roster as Record<string, string | null>[];

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: "No roster data" }, { status: 400 });
    }

    const { error: deleteError } = await supabase
      .from("roster")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    if (deleteError) throw deleteError;

    const { error: insertError } = await supabase.from("roster").insert(
      rows.map((r) => ({
        name:                 r.name,
        rank:                 r.rank,
        badge_number:         r.badge_number         ?? null,
        callsign:             r.callsign             ?? null,
        division:             r.division             ?? null,
        status:               ["Active","Inactive","LOA"].includes(r.status ?? "") ? r.status : "Active",
        avatar_url:           r.avatar_url           ?? null,
        joined_date:          r.joined_date          ?? null,
        phone_number:         r.phone_number         ?? null,
        april_total_activity: r.april_total_activity ?? null,
        april_patrol_hours:   r.april_patrol_hours   ?? null,
        april_admin_hours:    r.april_admin_hours    ?? null,
        april_patrol_logs:    r.april_patrol_logs    ?? null,
        march_total_activity: r.march_total_activity ?? null,
        march_patrol_hours:   r.march_patrol_hours   ?? null,
        march_admin_hours:    r.march_admin_hours    ?? null,
        march_patrol_logs:    r.march_patrol_logs    ?? null,
        patrol_last_seen:     r.patrol_last_seen     ?? null,
        admin_last_seen:      r.admin_last_seen      ?? null,
        updated_at:           new Date().toISOString(),
      }))
    );
    if (insertError) throw insertError;

    return NextResponse.json({ success: true, count: rows.length });
  } catch (err) {
    console.error("sync-roster error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
