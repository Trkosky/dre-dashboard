"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";
import type { DREData } from "@/lib/types";

interface RevenueChartProps {
  dre: DREData;
}

function fmt(val: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL",
    notation: "compact", maximumFractionDigits: 1,
  }).format(val);
}

export function RevenueChart({ dre }: RevenueChartProps) {
  const data = [
    { name: "Rec. Bruta",   valor: dre.receitaBruta,         color: "#6366f1" },
    { name: "Rec. Líquida", valor: dre.receitaLiquida,        color: "#3b82f6" },
    { name: "Lucro Bruto",  valor: dre.lucroBruto,            color: dre.lucroBruto >= 0    ? "#10b981" : "#ef4444" },
    { name: "EBITDA",       valor: dre.ebitda,                color: dre.ebitda >= 0        ? "#f59e0b" : "#ef4444" },
    { name: "Res. Oper.",   valor: dre.resultadoOperacional,  color: dre.resultadoOperacional >= 0 ? "#8b5cf6" : "#ef4444" },
    { name: "Lucro Líq.",   valor: dre.lucroLiquido,          color: dre.lucroLiquido >= 0  ? "#22c55e" : "#ef4444" },
  ];

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean; payload?: Array<{ value: number }>; label?: string;
  }) => {
    if (!active || !payload?.length) return null;
    const v = payload[0].value;
    return (
      <div className="bg-gray-900 text-white rounded-xl px-4 py-3 shadow-2xl text-sm">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        <p className={`font-bold text-base ${v < 0 ? "text-red-400" : "text-white"}`}>{fmt(v)}</p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-sm font-bold text-gray-800">Cascata de Resultado</h3>
        <p className="text-xs text-gray-400 mt-0.5">Da receita bruta ao lucro líquido</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={(v) => fmt(v)} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={72} />
          <ReferenceLine y={0} stroke="#e2e8f0" />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
          <Bar dataKey="valor" radius={[8, 8, 0, 0]} maxBarSize={52}>
            {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
