import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  if (!supabase) return NextResponse.json([]);

  const { data, error } = await supabase
    .from("trainer_cards")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json([], { status: 200 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const body = await req.json();
  const { name, pokemon_id, pokemon_name, card_color, issue_date, card_no } = body;

  const { data, error } = await supabase
    .from("trainer_cards")
    .insert([{ name, pokemon_id, pokemon_name, card_color, issue_date, card_no }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
