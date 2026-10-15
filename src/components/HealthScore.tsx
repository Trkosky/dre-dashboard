"use client";

import type { AnaliseIA } from "@/lib/types";

interface HealthScoreProps {
  analise: AnaliseIA;
}

const COLORS: Record<AnaliseIA["classificacao"], { bg: string; text: string; ring: string; bar: string }> = {
  Excelente: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200", bar: "bg-emerald-500" },
  Boa: { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200", bar: "bg-blue-500" },
  Regular: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200", bar: "bg-amber-500" },
  Crítica: { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200", bar: "bg-red-500" },
};

const STATUS_COLORS: Record<string, string> = {
  excelente: "text-emerald-600",
  bom: "text-blue-600",
  atencao: "text-amber-600",
  critico: "text-red-600",
};

const STATUS_BG: Record<string, string> = {
  excelente: "bg-emerald-100",
  bom: "bg-blue-100",
  atencao: "bg-amber-100",
  critico: "bg-red-100",
};

export function HealthScore({ analise }: HealthScoreProps) {
  const colors = COLORS[analise.classificacao];

  return (
    <div className={`rounded-2xl p-6 ring-1 ${colors.bg} ${colors.ring}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Score de Saúde</h2>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-5xl font-bold ${colors.text}`}>{analise.scoreGeral}</span>
            <span className="text-gray-400 text-lg">/100</span>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-xl text-sm font-semibold ${colors.bg} ${colors.text} ring-1 ${colors.ring}`}>
          {analise.classificacao}
        </div>
      </div>

      <div className="w-full bg-white/60 rounded-full h-3 mb-6">
        <div
          className={`h-3 rounded-full transition-all duration-700 ${colors.bar}`}
          style={{ width: `${analise.scoreGeral}%` }}
        />
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">{analise.resumoExecutivo}</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {analise.indicadores.map((ind) => (
          <div key={ind.nome} className={`rounded-xl p-3 ${STATUS_BG[ind.status]}`}>
            <p className="text-xs text-gray-500 font-medium">{ind.nome}</p>
            <p className={`text-lg font-bold mt-0.5 ${STATUS_COLORS[ind.status]}`}>
              {ind.valor.toFixed(1)}{ind.unidade}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{ind.descricao}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
