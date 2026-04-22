import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type SubsectionInput = {
  number: string;
  title: string;
  content: string;
  display_order: number;
};

type SectionInput = {
  number: string;
  title: string;
  display_order: number;
  subsections: SubsectionInput[];
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.secret !== process.env.SYNC_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sections = body.sections as SectionInput[];

    if (!Array.isArray(sections) || sections.length === 0) {
      return NextResponse.json({ error: "No SOP data" }, { status: 400 });
    }

    // Delete all existing sections (cascades to subsections)
    const { error: deleteError } = await supabase
      .from("sop_sections")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message ?? JSON.stringify(deleteError) },
        { status: 500 }
      );
    }

    // Insert sections and collect their new IDs
    const { data: insertedSections, error: sectionError } = await supabase
      .from("sop_sections")
      .insert(
        sections.map((s) => ({
          number:        s.number,
          title:         s.title,
          display_order: s.display_order,
        }))
      )
      .select("id, display_order");

    if (sectionError || !insertedSections) {
      return NextResponse.json(
        { error: sectionError?.message ?? "Failed to insert sections" },
        { status: 500 }
      );
    }

    // Build subsection rows with correct section_id
    const subsectionRows = insertedSections.flatMap((inserted) => {
      const section = sections.find((s) => s.display_order === inserted.display_order);
      if (!section) return [];
      return section.subsections.map((sub) => ({
        section_id:    inserted.id,
        number:        sub.number,
        title:         sub.title,
        content:       sub.content,
        display_order: sub.display_order,
      }));
    });

    if (subsectionRows.length > 0) {
      const { error: subError } = await supabase
        .from("sop_subsections")
        .insert(subsectionRows);

      if (subError) {
        return NextResponse.json(
          { error: subError.message ?? JSON.stringify(subError) },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true, sections: sections.length, subsections: subsectionRows.length });
  } catch (err) {
    console.error("sync-sop error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : JSON.stringify(err) },
      { status: 500 }
    );
  }
}
