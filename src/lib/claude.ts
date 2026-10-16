import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AnaliseIA } from "./types";
import type { ParsedContent } from "./parsers";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const PROMPT_SISTEMA = `Você é um especialista em análise financeira com foco no setor de transportes rodoviários de cargas no Brasil.
Analise o DRE fornecido e retorne um JSON estruturado com a análise completa da saúde financeira da empresa.

IMPORTANTE: Retorne APENAS o JSON, sem markdown, sem explicações, sem \`\`\`json.

O JSON deve seguir exatamente esta estrutura:
{
  "scoreGeral": número de 0 a 100,
  "classificacao": "Excelente" | "Boa" | "Regular" | "Crítica",
  "resumoExecutivo": "texto de 3-4 frases sobre a saúde geral",
  "pontosFortes": ["ponto 1", "ponto 2", "ponto 3"],
  "pontosAtencao": ["ponto 1", "ponto 2", "ponto 3"],
  "recomendacoes": ["rec 1", "rec 2", "rec 3"],
  "analiseSetorial": "análise comparativa com benchmarks do setor de transportes rodoviários",
  "indicadores": [
    {
      "nome": "Margem Bruta",
      "valor": número,
      "unidade": "%",
      "status": "excelente" | "bom" | "atencao" | "critico",
      "descricao": "explicação curta"
    }
  ],
  "dreData": {
    "empresa": "nome se disponível",
    "periodo": "período se disponível",
    "receitaBruta": número em reais,
    "deducoes": número em reais,
    "receitaLiquida": número em reais,
    "custosServicos": número em reais,
    "lucroBruto": número em reais,
    "despesasOperacionais": número em reais,
    "ebitda": número em reais,
    "depreciacaoAmortizacao": número em reais,
    "resultadoOperacional": número em reais,
    "resultadoFinanceiro": número em reais,
    "lucroAntesIR": número em reais,
    "ir": número em reais,
    "lucroLiquido": número em reais
  }
}

Para benchmarks do setor de transportes rodoviários de cargas no Brasil:
- Margem Bruta saudável: 20-35%
- Margem EBITDA saudável: 10-20%
- Margem Líquida saudável: 3-8%
- Participação do CPV/receita: 65-80%

Inclua no mínimo estes indicadores: Margem Bruta, Margem EBITDA, Margem Líquida, Representatividade do CPV, Resultado Financeiro/Receita.`;

export async function analisarDRE(content: ParsedContent): Promise<AnaliseIA> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  let result;

  if (content.base64 && content.mediaType) {
    result = await model.generateContent([
      PROMPT_SISTEMA + "\n\nAnalise este DRE e retorne o JSON conforme instruído.",
      {
        inlineData: {
          mimeType: content.mediaType,
          data: content.base64,
        },
      },
    ]);
  } else {
    result = await model.generateContent(
      `${PROMPT_SISTEMA}\n\nAnalise o seguinte DRE e retorne o JSON conforme instruído:\n\n${content.text}`
    );
  }

  const text = result.response.text();

  try {
    return JSON.parse(text) as AnaliseIA;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]) as AnaliseIA;
    throw new Error("Gemini não retornou JSON válido");
  }
}
