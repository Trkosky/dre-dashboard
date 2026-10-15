"use client";

import type { AnaliseIA } from "@/lib/types";
import { CheckCircle, AlertTriangle, Lightbulb, Truck } from "lucide-react";

interface AIInsightsProps {
  analise: AnaliseIA;
}

export function AIInsights({ analise }: AIInsightsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-emerald-800">Pontos Fortes</h3>
        </div>
        <ul className="space-y-2">
          {analise.pontosFortes.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm text-emerald-700">
              <span className="text-emerald-400 font-bold mt-0.5">•</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <h3 className="font-semibold text-amber-800">Pontos de Atenção</h3>
        </div>
        <ul className="space-y-2">
          {analise.pontosAtencao.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm text-amber-700">
              <span className="text-amber-400 font-bold mt-0.5">•</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-800">Recomendações</h3>
        </div>
        <ul className="space-y-2">
          {analise.recomendacoes.map((r, i) => (
            <li key={i} className="flex gap-2 text-sm text-blue-700">
              <span className="bg-blue-200 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">
                {i + 1}
              </span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Truck className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">Análise Setorial</h3>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{analise.analiseSetorial}</p>
      </div>
    </div>
  );
}
