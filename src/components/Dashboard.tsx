"use client";

import type { AnaliseIA } from "@/lib/types";
import { HealthScore } from "./HealthScore";
import { DRECards } from "./DRECards";
import { RevenueChart } from "./RevenueChart";
import { MarginChart } from "./MarginChart";
import { AIInsights } from "./AIInsights";
import { Building2, RefreshCw } from "lucide-react";

interface DashboardProps {
  analise: AnaliseIA;
  onReset: () => void;
}

export function Dashboard({ analise, onReset }: DashboardProps) {
  const { dreData } = analise;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {dreData.empresa || "Empresa"}
            </h1>
            {dreData.periodo && (
              <p className="text-sm text-gray-400">{dreData.periodo}</p>
            )}
          </div>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
        >
          <RefreshCw className="w-4 h-4" />
          Novo DRE
        </button>
      </div>

      <HealthScore analise={analise} />

      <DRECards dre={dreData} />

      <div className="grid gap-4 sm:grid-cols-2">
        <RevenueChart dre={dreData} />
        <MarginChart dre={dreData} />
      </div>

      <AIInsights analise={analise} />
    </div>
  );
}
