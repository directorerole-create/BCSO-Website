import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type RosterMember = {
  id: string;
  name: string;
  rank: string;
  badge_number: string | null;
  callsign: string | null;
  division: string | null;
  status: "Active" | "Inactive" | "LOA";
  avatar_url: string | null;
  joined_date: string | null;
  updated_at: string;
};

export type Policy = {
  id: string;
  title: string;
  category: string;
  content: string;
  doc_id: string | null;
  policy_number: string | null;
  last_updated: string;
};

export type StaffMember = {
  id: string;
  name: string;
  rank: string;
  role: string;
  bio: string | null;
  avatar_url: string | null;
  badge_number: string | null;
  division: string | null;
  join_date: string | null;
  contact_discord: string | null;
  display_order: number;
};
