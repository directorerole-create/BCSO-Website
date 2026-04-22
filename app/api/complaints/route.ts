import { NextRequest, NextResponse } from "next/server";
import { createServerClient, validateSession } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    reportNo, complainantName, websiteId, profileLink,
    officerName, officerWebsiteId, subdivision,
    dateOfIncident, timeOfIncident, description, evidenceName,
  } = body;

  if (!complainantName || !websiteId || !officerName || !dateOfIncident || !timeOfIncident || !description) {
    return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
  }

  const supabase = createServerClient();
  const { error } = await supabase.from("complaints").insert({
    report_no: reportNo,
    complainant_name: complainantName,
    website_id: websiteId,
    profile_link: profileLink || null,
    officer_name: officerName,
    officer_website_id: officerWebsiteId || null,
    subdivision: subdivision || null,
    date_of_incident: dateOfIncident,
    time_of_incident: timeOfIncident,
    description,
    evidence_name: evidenceName || null,
    status: "pending",
  });

  if (error) {
    console.error("Complaint insert error:", error);
    return NextResponse.json({ ok: false, error: "Failed to submit complaint." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") ?? null;
  const admin = await validateSession(token);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ complaints: data });
}

export async function PATCH(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") ?? null;
  const admin = await validateSession(token);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status } = await req.json();
  const valid = ["pending", "investigating", "resolved", "dismissed"];
  if (!id || !valid.includes(status)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const supabase = createServerClient();
  const { error } = await supabase.from("complaints").update({ status }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
