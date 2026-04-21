import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/sync-roster
// Called by Google Apps Script when the roster sheet changes.
// Body: { secret: string, roster: RosterRow[] }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.secret !== process.env.SYNC_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rows: {
      name: string;
      rank: string;
      badge_number?: string;
      callsign?: string;
      division?: string;
      status?: string;
      avatar_url?: string;
      joined_date?: string;
    }[] = body.roster;

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: "No roster data" }, { status: 400 });
    }

    // Full replace — delete all and re-insert
    const { error: deleteError } = await supabase.from("roster").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (deleteError) throw deleteError;

    const { error: insertError } = await supabase.from("roster").insert(
      rows.map((r) => ({
        name: r.name,
        rank: r.rank,
        badge_number: r.badge_number ?? null,
        callsign: r.callsign ?? null,
        division: r.division ?? null,
        status: (["Active", "Inactive", "LOA"].includes(r.status ?? "") ? r.status : "Active") as string,
        avatar_url: r.avatar_url ?? null,
        joined_date: r.joined_date ?? null,
        updated_at: new Date().toISOString(),
      }))
    );
    if (insertError) throw insertError;

    return NextResponse.json({ success: true, count: rows.length });
  } catch (err) {
    console.error("sync-roster error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
