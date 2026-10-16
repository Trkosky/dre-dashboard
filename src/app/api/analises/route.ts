import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

const FIXED_USER_ID = "00000000-0000-0000-0000-000000000001";

async function isAuth() {
  const jar = await cookies();
  return jar.get("dre_session")?.value === "authenticated";
}

export async function GET(req: NextRequest) {
  if (!await isAuth()) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const supabase = await createClient();
  const empresaId = req.nextUrl.searchParams.get("empresa_id");
  let query = supabase
    .from("analises")
    .select("id, empresa_id, periodo, mes, ano, arquivo_nome, score, created_at, analise_ia, dre_data")
    .order("ano", { ascending: false })
    .order("mes", { ascending: false });

  if (empresaId) query = query.eq("empresa_id", empresaId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!await isAuth()) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const supabase = await createClient();
  const body = await req.json();
  const { data, error } = await supabase
    .from("analises")
    .insert({ ...body, user_id: FIXED_USER_ID })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
