import { NextRequest, NextResponse } from "next/server";
import { parseFile } from "@/lib/parsers";
import { analisarDRE } from "@/lib/claude";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const empresaId = formData.get("empresa_id") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = await parseFile(buffer, file.type, file.name);
    const analise = await analisarDRE(parsed);

    // Salvar no banco se o usuário estiver autenticado e empresa selecionada
    if (empresaId) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const periodoStr = analise.dreData.periodo || "";
        const anoMatch = periodoStr.match(/\d{4}/);
        const mesMatch = periodoStr.match(/\b(\d{1,2})\b/);

        await supabase.from("analises").insert({
          empresa_id: empresaId,
          user_id: user.id,
          periodo: periodoStr,
          mes: mesMatch ? parseInt(mesMatch[1]) : null,
          ano: anoMatch ? parseInt(anoMatch[0]) : new Date().getFullYear(),
          arquivo_nome: file.name,
          dre_data: analise.dreData,
          analise_ia: analise,
          score: analise.scoreGeral,
        });
      }
    }

    return NextResponse.json(analise);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
