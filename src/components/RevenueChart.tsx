"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { DREData } from "@/lib/types";

interface RevenueChartProps {
  dre: DREData;
}

function fmtM(val: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(val);
}

export function RevenueChart({ dre }: RevenueChartProps) {
  const data = [
    { name: "Rec. Bruta", valor: dre.receitaBruta, color: "#3b82f6" },
    { name: "Rec. Líquida", valor: dre.receitaLiquida, color: "#6366f1" },
    { name: "Lucro Bruto", valor: dre.lucroBruto, color: dre.lucroBruto >= 0 ? "#10b981" : "#ef4444" },
    { name: "EBITDA", valor: dre.ebitda, color: dre.ebitda >= 0 ? "#f59e0b" : "#ef4444" },
    {
      name: "Lucro Líquido",
      valor: dre.lucroLiquido,
      color: dre.lucroLiquido >= 0 ? "#22c55e" : "#ef4444",
    },
  ];

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-lg text-sm">
          <p className="font-medium text-gray-700">{label}</p>
          <p className="text-gray-900 font-bold mt-0.5">{fmtM(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Cascata de Resultado
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => fmtM(v)}
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            width={70}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
