import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/sync-policies
// Called by Google Apps Script when a policy Doc changes.
// Body: { secret: string, policy: PolicyRow } — single policy upsert
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.secret !== process.env.SYNC_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const policy: {
      doc_id: string;
      title: string;
      category: string;
      content: string;
      policy_number?: string;
    } = body.policy;

    if (!policy.doc_id || !policy.title || !policy.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { error } = await supabase.from("policies").upsert(
      {
        doc_id: policy.doc_id,
        title: policy.title,
        category: policy.category ?? "General",
        content: policy.content,
        policy_number: policy.policy_number ?? null,
        last_updated: new Date().toISOString(),
      },
      { onConflict: "doc_id" }
    );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("sync-policies error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
