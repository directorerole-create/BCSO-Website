import { supabase, RosterMember } from "@/lib/supabase";
import { RosterClient } from "./RosterClient";

async function getRoster(): Promise<RosterMember[]> {
  try {
    const { data, error } = await supabase.from("roster").select("*");
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function RosterPage() {
  const roster = await getRoster();
  return <RosterClient roster={roster} />;
}
