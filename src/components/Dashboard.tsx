"use client";

import type { AnaliseIA } from "@/lib/types";
import { HealthScore } from "./HealthScore";
import { DRECards } from "./DRECards";
import { RevenueChart } from "./RevenueChart";
import { MarginChart } from "./MarginChart";
import { AIInsights } from "./AIInsights";
import { RotateCcw } from "lucide-react";

interface DashboardProps {
  analise: AnaliseIA;
  onReset: () => void;
}

export function Dashboard({ analise, onReset }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Score principal */}
      <HealthScore analise={analise} />

      {/* Separador */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Demonstrativo Financeiro</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Cards DRE */}
      <DRECards dre={analise.dreData} />

      {/* Separador */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Gráficos</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 sm:grid-cols-2">
        <RevenueChart dre={analise.dreData} />
        <MarginChart dre={analise.dreData} />
      </div>

      {/* Separador */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Análise da IA</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Insights */}
      <AIInsights analise={analise} />

      {/* Rodapé */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors px-4 py-2 rounded-xl hover:bg-gray-100"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Analisar outro DRE
        </button>
      </div>
    </div>
  );
}
