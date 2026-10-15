"use client";

import type { DREData } from "@/lib/types";
import { TrendingUp, TrendingDown, DollarSign, Minus } from "lucide-react";

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

function pct(num: number, den: number) {
  if (!den) return "0%";
  return ((num / den) * 100).toFixed(1) + "%";
}

interface CardProps {
  label: string;
  value: number;
  sub?: string;
  positive?: boolean | null;
}

function Card({ label, value, sub, positive }: CardProps) {
  const Icon =
    positive === null ? Minus : positive ? TrendingUp : TrendingDown;
  const color =
    positive === null
      ? "text-gray-400"
      : positive
      ? "text-emerald-600"
      : "text-red-500";

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <p className={`text-xl font-bold mt-2 ${value < 0 ? "text-red-600" : "text-gray-800"}`}>
        {fmt(value)}
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export function DRECards({ dre }: DRECardsProps) {
  const margemBruta = dre.receitaLiquida ? (dre.lucroBruto / dre.receitaLiquida) * 100 : 0;
  const margemLiquida = dre.receitaLiquida ? (dre.lucroLiquido / dre.receitaLiquida) * 100 : 0;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
        <DollarSign className="w-4 h-4" />
        Demonstrativo de Resultado
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <Card label="Receita Bruta" value={dre.receitaBruta} positive={null} />
        <Card
          label="Receita Líquida"
          value={dre.receitaLiquida}
          sub={pct(dre.receitaLiquida, dre.receitaBruta) + " da Bruta"}
          positive={null}
        />
        <Card
          label="Lucro Bruto"
          value={dre.lucroBruto}
          sub={`Margem: ${margemBruta.toFixed(1)}%`}
          positive={dre.lucroBruto > 0}
        />
        <Card
          label="EBITDA"
          value={dre.ebitda}
          sub={pct(dre.ebitda, dre.receitaLiquida) + " da Rec. Líq."}
          positive={dre.ebitda > 0}
        />
        <Card
          label="Res. Operacional"
          value={dre.resultadoOperacional}
          positive={dre.resultadoOperacional > 0}
        />
        <Card
          label="Res. Financeiro"
          value={dre.resultadoFinanceiro}
          positive={dre.resultadoFinanceiro >= 0}
        />
        <Card
          label="Lucro Antes IR"
          value={dre.lucroAntesIR}
          positive={dre.lucroAntesIR > 0}
        />
        <Card
          label="Lucro Líquido"
          value={dre.lucroLiquido}
          sub={`Margem: ${margemLiquida.toFixed(1)}%`}
          positive={dre.lucroLiquido > 0}
        />
      </div>
    </div>
  );
}
