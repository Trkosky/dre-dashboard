"use client";

import { useEffect, useState } from "react";
import type { AnaliseRecord } from "@/lib/types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { History, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface HistoricoProps {
  empresaId: string;
  onCarregar: (analise: AnaliseRecord["analise_ia"]) => void;
}

const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

const STATUS_COLORS: Record<string, string> = {
  Excelente: "bg-emerald-100 text-emerald-700",
  Boa: "bg-blue-100 text-blue-700",
  Regular: "bg-amber-100 text-amber-700",
  Crítica: "bg-red-100 text-red-700",
};

export function Historico({ empresaId, onCarregar }: HistoricoProps) {
  const [registros, setRegistros] = useState<AnaliseRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analises?empresa_id=${empresaId}`)
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setRegistros(d);
        setLoading(false);
      });
  }, [empresaId]);

  if (loading) return null;
  if (registros.length === 0) return null;

  const chartData = [...registros]
    .reverse()
    .map((r) => ({
      label: r.mes ? `${MESES[r.mes - 1]}/${String(r.ano).slice(2)}` : r.periodo || "—",
      score: r.score,
      periodo: r.periodo,
    }));

  const ultimo = registros[0];
  const penultimo = registros[1];
  const variacao = penultimo ? ultimo.score - penultimo.score : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Histórico de Saúde
          </h3>
        </div>
        {variacao !== null && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            variacao > 0 ? "text-emerald-600" : variacao < 0 ? "text-red-500" : "text-gray-400"
          }`}>
            {variacao > 0 ? <TrendingUp className="w-4 h-4" /> :
             variacao < 0 ? <TrendingDown className="w-4 h-4" /> :
             <Minus className="w-4 h-4" />}
            {variacao > 0 ? "+" : ""}{variacao} pts
          </div>
        )}
      </div>

      {chartData.length > 1 && (
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <ReferenceLine y={70} stroke="#d1d5db" strokeDasharray="4 4" />
            <Tooltip
              content={({ active, payload, label }) =>
                active && payload?.length ? (
                  <div className="bg-white border border-gray-100 rounded-xl p-2 shadow-lg text-xs">
                    <p className="text-gray-500">{label}</p>
                    <p className="font-bold text-blue-600">{payload[0].value}/100</p>
                  </div>
                ) : null
              }
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ fill: "#3b82f6", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      <div className="mt-4 space-y-2 max-h-52 overflow-y-auto">
        {registros.map((r) => (
          <button
            key={r.id}
            onClick={() => onCarregar(r.analise_ia)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left group"
          >
            <div>
              <p className="text-sm font-medium text-gray-700">
                {r.periodo || (r.mes ? `${MESES[r.mes - 1]} ${r.ano}` : "Sem período")}
              </p>
              {r.arquivo_nome && (
                <p className="text-xs text-gray-400">{r.arquivo_nome}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                STATUS_COLORS[r.analise_ia.classificacao] || "bg-gray-100 text-gray-600"
              }`}>
                {r.analise_ia.classificacao}
              </span>
              <span className="text-sm font-bold text-gray-700">{r.score}</span>
              <span className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                Carregar →
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
