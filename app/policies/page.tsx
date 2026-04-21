import { supabase, Policy } from "@/lib/supabase";
import { PoliciesClient } from "./PoliciesClient";

async function getPolicies(): Promise<Policy[]> {
  try {
    const { data, error } = await supabase
      .from("policies")
      .select("*")
      .order("category", { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function PoliciesPage() {
  const policies = await getPolicies();
  return <PoliciesClient policies={policies} />;
}
