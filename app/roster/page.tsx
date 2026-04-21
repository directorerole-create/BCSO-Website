import { supabase, RosterMember } from "@/lib/supabase";
import { RosterClient } from "./RosterClient";

async function getRoster(): Promise<RosterMember[]> {
  try {
    const { data, error } = await supabase
      .from("roster")
      .select("*")
      .order("rank", { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

const RANK_ORDER: Record<string, number> = {
  "Sheriff": 1,
  "Undersheriff": 2,
  "Captain": 3,
  "Lieutenant": 4,
  "Sergeant": 5,
  "Detective": 6,
  "Senior Deputy": 7,
  "Deputy": 8,
  "Probationary Deputy": 9,
};

export default async function RosterPage() {
  const roster = await getRoster();
  const sorted = [...roster].sort((a, b) => {
    const ao = RANK_ORDER[a.rank] ?? 99;
    const bo = RANK_ORDER[b.rank] ?? 99;
    return ao !== bo ? ao - bo : a.name.localeCompare(b.name);
  });
  return <RosterClient roster={sorted} />;
}
