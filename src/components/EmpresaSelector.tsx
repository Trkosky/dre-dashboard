"use client";

import { useEffect, useState } from "react";
import type { Empresa } from "@/lib/types";
import { Building2, Plus, ChevronDown } from "lucide-react";

interface EmpresaSelectorProps {
  selectedId: string | null;
  onSelect: (empresa: Empresa) => void;
}

export function EmpresaSelector({ selectedId, onSelect }: EmpresaSelectorProps) {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [open, setOpen] = useState(false);
  const [criando, setCriando] = useState(false);
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");

  useEffect(() => {
    fetch("/api/empresas")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setEmpresas(d));
  }, []);

  const selected = empresas.find((e) => e.id === selectedId);

  async function criarEmpresa() {
    if (!nome.trim()) return;
    const res = await fetch("/api/empresas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: nome.trim(), cnpj: cnpj.trim() }),
    });
    const nova = await res.json();
    setEmpresas((prev) => [...prev, nova]);
    onSelect(nova);
    setCriando(false);
    setNome("");
    setCnpj("");
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:border-blue-400 bg-white text-sm transition-colors"
      >
        <Building2 className="w-4 h-4 text-gray-400" />
        <span className="text-gray-700 font-medium max-w-[180px] truncate">
          {selected ? selected.nome : "Selecionar empresa"}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden">
          <div className="p-2 max-h-52 overflow-y-auto">
            {empresas.length === 0 && !criando && (
              <p className="text-xs text-gray-400 px-3 py-2">Nenhuma empresa cadastrada</p>
            )}
            {empresas.map((e) => (
              <button
                key={e.id}
                onClick={() => { onSelect(e); setOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors ${
                  e.id === selectedId ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                }`}
              >
                {e.nome}
                {e.cnpj && <span className="text-xs text-gray-400 ml-2">{e.cnpj}</span>}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100 p-2">
            {!criando ? (
              <button
                onClick={() => setCriando(true)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-xl transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Nova empresa
              </button>
            ) : (
              <div className="space-y-2 p-1">
                <input
                  autoFocus
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome da empresa *"
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  placeholder="CNPJ (opcional)"
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={criarEmpresa}
                    className="flex-1 bg-blue-600 text-white text-xs font-medium py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setCriando(false)}
                    className="flex-1 border border-gray-200 text-xs text-gray-600 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
