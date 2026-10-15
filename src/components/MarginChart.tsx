"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { DREData } from "@/lib/types";

interface MarginChartProps {
  dre: DREData;
}

export function MarginChart({ dre }: MarginChartProps) {
  const rec = dre.receitaLiquida || 1;

  const data = [
    {
      metric: "Margem Bruta",
      valor: Math.max(0, Math.min(100, (dre.lucroBruto / rec) * 100)),
      benchmark: 27,
    },
    {
      metric: "Margem EBITDA",
      valor: Math.max(0, Math.min(100, (dre.ebitda / rec) * 100)),
      benchmark: 15,
    },
    {
      metric: "Margem Líquida",
      valor: Math.max(0, Math.min(100, (dre.lucroLiquido / rec) * 100)),
      benchmark: 5,
    },
    {
      metric: "Res. Operacional",
      valor: Math.max(0, Math.min(100, (dre.resultadoOperacional / rec) * 100)),
      benchmark: 8,
    },
    {
      metric: "Controle CPV",
      valor: Math.max(
        0,
        Math.min(100, 100 - (dre.custosServicos / rec) * 100)
      ),
      benchmark: 28,
    },
  ];

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-lg text-sm">
          <p className="font-medium text-gray-700">{label}</p>
          {payload.map((p) => (
            <p key={p.name} style={{ color: p.color }} className="font-bold">
              {p.name}: {p.value.toFixed(1)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
        Radar de Margens
      </h3>
      <p className="text-xs text-gray-400 mb-3">Empresa vs. Benchmark do setor</p>
      <ResponsiveContainer width="100%" height={240}>
        <RadarChart data={data}>
          <PolarGrid stroke="#f0f0f0" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fontSize: 11, fill: "#6b7280" }}
          />
          <Radar
            name="Benchmark"
            dataKey="benchmark"
            stroke="#d1d5db"
            fill="#d1d5db"
            fillOpacity={0.3}
          />
          <Radar
            name="Empresa"
            dataKey="valor"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.4}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
