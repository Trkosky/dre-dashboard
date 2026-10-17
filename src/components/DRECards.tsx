"use client";

import type { DREData } from "@/lib/types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DRECardsProps {
  dre: DREData;
}

function fmt(val: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(val);
}

function fmtFull(val: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(val);
}

function pct(num: number, den: number) {
  if (!den) return "—";
  return ((num / den) * 100).toFixed(1) + "%";
}

interface CardProps {
  label: string;
  value: number;
  sub?: string;
  positive?: boolean | null;
  highlight?: boolean;
  size?: "normal" | "large";
}

function Card({ label, value, sub, positive, highlight, size = "normal" }: CardProps) {
  const isPositive = positive === null ? null : positive;
  const Icon = isPositive === null ? Minus : isPositive ? TrendingUp : TrendingDown;
  const iconColor = isPositive === null ? "text-gray-300" : isPositive ? "text-emerald-500" : "text-red-400";
  const valueColor = value < 0 ? "text-red-600" : highlight ? "text-blue-700" : "text-gray-900";

  return (
    <div className={`relative rounded-2xl border p-5 transition-all hover:shadow-md ${
      highlight
        ? "bg-gradient-to-br from-blue-600 to-indigo-700 border-blue-500 shadow-lg shadow-blue-200/50"
        : "bg-white border-gray-100 shadow-sm"
    }`}>
      <div className="flex items-start justify-between mb-3">
        <p className={`text-xs font-semibold uppercase tracking-wide ${highlight ? "text-blue-100" : "text-gray-400"}`}>
          {label}
        </p>
        <Icon className={`w-4 h-4 ${highlight ? "text-blue-200" : iconColor}`} />
      </div>
      <p className={`font-black leading-none ${highlight ? "text-white" : valueColor} ${size === "large" ? "text-3xl" : "text-2xl"}`}>
        {fmt(value)}
      </p>
      {sub && (
        <p className={`text-xs mt-2 font-medium ${highlight ? "text-blue-200" : "text-gray-400"}`}>{sub}</p>
      )}
      {!highlight && (
        <p className={`text-xs mt-1 ${value < 0 ? "text-red-400" : "text-gray-300"}`}>{fmtFull(value)}</p>
      )}
    </div>
  );
}

export function DRECards({ dre }: DRECardsProps) {
  const margemBruta = dre.receitaLiquida ? (dre.lucroBruto / dre.receitaLiquida) * 100 : 0;
  const margemEbitda = dre.receitaLiquida ? (dre.ebitda / dre.receitaLiquida) * 100 : 0;
  const margemLiquida = dre.receitaLiquida ? (dre.lucroLiquido / dre.receitaLiquida) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Bloco Receitas */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Receitas</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card label="Receita Bruta" value={dre.receitaBruta} positive={null} />
          <Card label="Deduções" value={-dre.deducoes} positive={null} />
          <Card label="Receita Líquida" value={dre.receitaLiquida} positive={null} highlight />
          <Card label="Custo dos Serviços" value={-dre.custosServicos}
            sub={`${pct(dre.custosServicos, dre.receitaLiquida)} da rec. líq.`}
            positive={dre.custosServicos / dre.receitaLiquida < 0.75} />
        </div>
      </div>

      {/* Bloco Resultados */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Resultados</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card label="Lucro Bruto" value={dre.lucroBruto}
            sub={`Margem ${margemBruta.toFixed(1)}%`}
            positive={dre.lucroBruto > 0} />
          <Card label="EBITDA" value={dre.ebitda}
            sub={`Margem ${margemEbitda.toFixed(1)}%`}
            positive={dre.ebitda > 0} />
          <Card label="Res. Operacional" value={dre.resultadoOperacional}
            positive={dre.resultadoOperacional > 0} />
          <Card label="Res. Financeiro" value={dre.resultadoFinanceiro}
            positive={dre.resultadoFinanceiro >= 0} />
        </div>
      </div>

      {/* Bloco Bottom line */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Bottom line</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card label="Lucro Antes IR" value={dre.lucroAntesIR} positive={dre.lucroAntesIR > 0} />
          <Card label="IR e CSLL" value={-dre.ir} positive={null} />
          <Card label="Depreciação" value={-dre.depreciacaoAmortizacao} positive={null} />
          <Card label="Lucro Líquido" value={dre.lucroLiquido}
            sub={`Margem ${margemLiquida.toFixed(1)}%`}
            positive={dre.lucroLiquido > 0} highlight={dre.lucroLiquido > 0} size="large" />
        </div>
      </div>
    </div>
  );
}
