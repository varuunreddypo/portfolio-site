import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const isConfigured = url.startsWith("http") && key.length > 20;

export const supabase: SupabaseClient | null = isConfigured
  ? createClient(url, key)
  : null;

export type TrainerCard = {
  id: number;
  name: string;
  pokemon_id: number;
  pokemon_name: string;
  card_color: string;
  issue_date: string;
  card_no: number;
  created_at: string;
};
