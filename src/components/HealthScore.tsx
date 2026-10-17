"use client";

import type { AnaliseIA } from "@/lib/types";
import { ShieldCheck, TrendingUp, AlertTriangle, XCircle } from "lucide-react";

interface HealthScoreProps {
  analise: AnaliseIA;
}

const CONFIG = {
  Excelente: {
    gradient: "from-emerald-500 to-teal-600",
    light: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
    badge: "bg-emerald-500",
    icon: ShieldCheck,
    glow: "shadow-emerald-200",
  },
  Boa: {
    gradient: "from-blue-500 to-indigo-600",
    light: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
    badge: "bg-blue-500",
    icon: TrendingUp,
    glow: "shadow-blue-200",
  },
  Regular: {
    gradient: "from-amber-400 to-orange-500",
    light: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-500",
    icon: AlertTriangle,
    glow: "shadow-amber-200",
  },
  Crítica: {
    gradient: "from-red-500 to-rose-600",
    light: "bg-red-50 border-red-200",
    text: "text-red-700",
    badge: "bg-red-500",
    icon: XCircle,
    glow: "shadow-red-200",
  },
};

const STATUS_STYLE: Record<string, { bg: string; text: string; dot: string }> = {
  excelente: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  bom:       { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500"    },
  atencao:   { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500"   },
  critico:   { bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-500"     },
};

export function HealthScore({ analise }: HealthScoreProps) {
  const cfg = CONFIG[analise.classificacao];
  const Icon = cfg.icon;
  const pct = analise.scoreGeral;

  return (
    <div className="rounded-3xl overflow-hidden shadow-xl shadow-gray-200/60">
      {/* Header gradient */}
      <div className={`bg-gradient-to-r ${cfg.gradient} px-8 py-7`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Icon className="w-5 h-5 text-white/90" />
              <span className="text-white/80 text-sm font-medium uppercase tracking-widest">
                Score de Saúde Financeira
              </span>
            </div>
            <div className="flex items-end gap-2 mt-3">
              <span className="text-7xl font-black text-white leading-none">{pct}</span>
              <span className="text-white/60 text-2xl font-light mb-2">/100</span>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-bold px-4 py-2 rounded-2xl border border-white/30">
              {analise.classificacao}
            </span>
            {analise.dreData.empresa && (
              <p className="text-white/70 text-sm mt-3 max-w-[200px] text-right leading-tight">
                {analise.dreData.empresa}
              </p>
            )}
            {analise.dreData.periodo && (
              <p className="text-white/50 text-xs mt-1">{analise.dreData.periodo}</p>
            )}
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="mt-5">
          <div className="w-full bg-white/20 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full bg-white transition-all duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-white/40 text-xs mt-1.5">
            <span>0 — Crítico</span>
            <span>50 — Regular</span>
            <span>100 — Excelente</span>
          </div>
        </div>
      </div>

      {/* Resumo executivo */}
      <div className="bg-white px-8 py-5 border-b border-gray-100">
        <p className="text-gray-600 text-sm leading-relaxed">{analise.resumoExecutivo}</p>
      </div>

      {/* Indicadores */}
      <div className="bg-white px-8 pb-7 pt-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Indicadores-chave
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {analise.indicadores.map((ind) => {
            const s = STATUS_STYLE[ind.status] ?? STATUS_STYLE.bom;
            return (
              <div key={ind.nome} className={`rounded-2xl p-4 ${s.bg} border border-white`}>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <p className="text-xs font-medium text-gray-500 leading-tight">{ind.nome}</p>
                </div>
                <p className={`text-2xl font-black ${s.text}`}>
                  {ind.valor.toFixed(1)}<span className="text-base font-semibold">{ind.unidade}</span>
                </p>
                <p className="text-xs text-gray-400 mt-1 leading-tight">{ind.descricao}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
