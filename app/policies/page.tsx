import { createClient } from "@supabase/supabase-js";
import { PoliciesClient } from "./PoliciesClient";
import { SopSection } from "@/lib/sop-data";

export const dynamic = "force-dynamic";

async function getSop(): Promise<SopSection[]> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from("sop_sections")
      .select(`id, number, title, display_order, sop_subsections(id, number, title, content, display_order)`)
      .order("display_order", { ascending: true });

    if (error || !data) return [];

    return data.map((s) => ({
      id:    s.id,
      number: s.number,
      title:  s.title,
      subsections: [...(s.sop_subsections as { id: string; number: string; title: string; content: string; display_order: number }[])]
        .sort((a, b) => a.display_order - b.display_order)
        .map((sub) => ({
          id:      sub.id,
          number:  sub.number,
          title:   sub.title,
          content: sub.content,
        })),
    }));
  } catch {
    return [];
  }
}

export default async function PoliciesPage() {
  const sections = await getSop();
  return <PoliciesClient sections={sections} />;
}
