import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

async function isAuth() {
  const jar = await cookies();
  return jar.get("dre_session")?.value === "authenticated";
}

export async function GET() {
  if (!await isAuth()) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("empresas")
    .select("*")
    .order("nome");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!await isAuth()) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const supabase = await createClient();
  const body = await req.json();
  const { data, error } = await supabase
    .from("empresas")
    .insert({ ...body, user_id: "00000000-0000-0000-0000-000000000001" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
