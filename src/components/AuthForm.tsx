"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Truck, Loader2 } from "lucide-react";

interface AuthFormProps {
  onAuth: () => void;
}

export function AuthForm({ onAuth }: AuthFormProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [form, setForm] = useState({ nome: "", email: "", password: "" });

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    if (mode === "register") {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { nome: form.nome } },
      });

      if (error) {
        setMsg({ text: error.message, ok: false });
        setLoading(false);
        return;
      }

      // Tenta logar direto — funciona se confirmação de e-mail estiver desabilitada
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (!loginError) {
        onAuth();
        return;
      }

      setMsg({
        text: "Conta criada! Verifique seu e-mail e clique no link de confirmação para entrar.",
        ok: true,
      });
      setLoading(false);
      return;
    }

    // Login
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (error) {
      const msg =
        error.message.includes("Invalid login")
          ? "E-mail ou senha incorretos."
          : error.message.includes("Email not confirmed")
          ? "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada."
          : error.message;
      setMsg({ text: msg, ok: false });
      return;
    }

    onAuth();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">DRE Dashboard</h1>
            <p className="text-xs text-gray-400">Transportes Rodoviários</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setMsg(null); }}
                className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  mode === m ? "bg-white shadow-sm text-gray-900" : "text-gray-500"
                }`}
              >
                {m === "login" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-xs font-medium text-gray-600">Nome</label>
                <input
                  type="text"
                  required
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Seu nome"
                />
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-gray-600">E-mail</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Senha</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            {msg && (
              <p className={`text-xs px-3 py-2 rounded-lg ${
                msg.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
              }`}>
                {msg.text}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "login" ? "Entrar" : "Criar conta"}
            </button>
          </form>
        </div>

        {mode === "register" && (
          <p className="text-center text-xs text-gray-400 mt-4">
            Após criar a conta, verifique seu e-mail para confirmar o acesso.
          </p>
        )}
      </div>
    </div>
  );
}
