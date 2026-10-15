"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { AnaliseIA, Empresa } from "@/lib/types";

import { AuthForm } from "@/components/AuthForm";
import { FileUpload } from "@/components/FileUpload";
import { Dashboard } from "@/components/Dashboard";
import { EmpresaSelector } from "@/components/EmpresaSelector";
import { Historico } from "@/components/Historico";
import { ExportPDF } from "@/components/ExportPDF";
import { Truck, LogOut } from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [analise, setAnalise] = useState<AnaliseIA | null>(null);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [erro, setErro] = useState("");

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function logout() {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    setUser(null);
    setAnalise(null);
    setEmpresa(null);
  }

  // Carregando sessão
  if (user === undefined) return null;

  // Não autenticado
  if (!user) return <AuthForm onAuth={() => supabase.auth.getUser().then(({ data }) => setUser(data.user))} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">DRE Dashboard</h1>
              <p className="text-xs text-gray-400">Transportes Rodoviários de Cargas</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <EmpresaSelector
              selectedId={empresa?.id ?? null}
              onSelect={(e) => { setEmpresa(e); setAnalise(null); }}
            />
            <button
              onClick={logout}
              className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {!analise ? (
          <>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">Análise de Saúde Financeira</h2>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                {empresa
                  ? `Envie o DRE de ${empresa.nome} para análise`
                  : "Selecione uma empresa e envie o DRE para análise"}
              </p>
            </div>

            <div className="max-w-xl mx-auto">
              <FileUpload
                empresaId={empresa?.id}
                onAnalise={(data) => setAnalise(data as AnaliseIA)}
                onError={setErro}
              />
              {erro && (
                <div className="mt-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700">
                  {erro}
                </div>
              )}
            </div>

            {empresa && (
              <Historico
                empresaId={empresa.id}
                onCarregar={(a) => setAnalise(a as AnaliseIA)}
              />
            )}
          </>
        ) : (
          <>
            <div className="flex justify-end">
              <ExportPDF
                targetId="dashboard-content"
                nomeEmpresa={empresa?.nome ?? analise.dreData.empresa ?? "empresa"}
                periodo={analise.dreData.periodo}
              />
            </div>
            <div id="dashboard-content">
              <Dashboard
                analise={analise}
                onReset={() => { setAnalise(null); setErro(""); }}
              />
            </div>
            {empresa && (
              <Historico
                empresaId={empresa.id}
                onCarregar={(a) => setAnalise(a as AnaliseIA)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
