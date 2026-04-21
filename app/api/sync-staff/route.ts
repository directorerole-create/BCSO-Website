import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/sync-staff
// Called by Google Apps Script when the staff sheet changes.
// Body: { secret: string, staff: StaffRow[] }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.secret !== process.env.SYNC_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rows: {
      name: string;
      rank: string;
      role: string;
      bio?: string;
      avatar_url?: string;
      badge_number?: string;
      division?: string;
      join_date?: string;
      contact_discord?: string;
      display_order?: number;
    }[] = body.staff;

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: "No staff data" }, { status: 400 });
    }

    const { error: deleteError } = await supabase.from("staff").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (deleteError) throw deleteError;

    const { error: insertError } = await supabase.from("staff").insert(
      rows.map((r, idx) => ({
        name: r.name,
        rank: r.rank,
        role: r.role,
        bio: r.bio ?? null,
        avatar_url: r.avatar_url ?? null,
        badge_number: r.badge_number ?? null,
        division: r.division ?? null,
        join_date: r.join_date ?? null,
        contact_discord: r.contact_discord ?? null,
        display_order: r.display_order ?? idx,
      }))
    );
    if (insertError) throw insertError;

    return NextResponse.json({ success: true, count: rows.length });
  } catch (err) {
    console.error("sync-staff error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
