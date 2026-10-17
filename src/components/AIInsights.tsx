"use client";

import type { AnaliseIA } from "@/lib/types";
import { CheckCircle2, AlertTriangle, Lightbulb, Truck, ArrowRight } from "lucide-react";

interface AIInsightsProps {
  analise: AnaliseIA;
}

export function AIInsights({ analise }: AIInsightsProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Pontos Fortes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 bg-emerald-50 border-b border-emerald-100">
            <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-emerald-800">Pontos Fortes</h3>
          </div>
          <ul className="px-6 py-4 space-y-3">
            {analise.pontosFortes.map((p, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-600">
                <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pontos de Atenção */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 bg-amber-50 border-b border-amber-100">
            <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-amber-800">Pontos de Atenção</h3>
          </div>
          <ul className="px-6 py-4 space-y-3">
            {analise.pontosAtencao.map((p, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-600">
                <ArrowRight className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recomendações + Análise Setorial */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 bg-blue-50 border-b border-blue-100">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-blue-800">Recomendações Estratégicas</h3>
          </div>
          <ul className="px-6 py-4 space-y-3">
            {analise.recomendacoes.map((r, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-600">
                <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border-b border-slate-100">
            <div className="w-8 h-8 bg-slate-700 rounded-xl flex items-center justify-center">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Análise Setorial</h3>
              <p className="text-xs text-slate-400">Transportes Rodoviários de Cargas</p>
            </div>
          </div>
          <div className="px-6 py-4">
            <p className="text-sm text-gray-600 leading-relaxed">{analise.analiseSetorial}</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Benchmarks do setor</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Margem Bruta", ref: "20–35%" },
                  { label: "Margem EBITDA", ref: "10–20%" },
                  { label: "Margem Líquida", ref: "3–8%" },
                ].map((b) => (
                  <div key={b.label} className="bg-slate-50 rounded-xl p-2.5 text-center">
                    <p className="text-xs text-gray-400 leading-tight">{b.label}</p>
                    <p className="text-sm font-bold text-slate-700 mt-1">{b.ref}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
