import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const SESSION_COOKIE = "dre_session";
const SESSION_VALUE = "authenticated";

export async function POST(req: NextRequest) {
  const { password, action } = await req.json();

  if (action === "logout") {
    const jar = await cookies();
    jar.delete(SESSION_COOKIE);
    return NextResponse.json({ ok: true });
  }

  if (action === "check") {
    const jar = await cookies();
    const valid = jar.get(SESSION_COOKIE)?.value === SESSION_VALUE;
    return NextResponse.json({ authenticated: valid });
  }

  const correctPassword = (process.env.APP_PASSWORD ?? "")
    .split("")
    .filter((c) => c.charCodeAt(0) >= 32 && c.charCodeAt(0) <= 126)
    .join("")
    .trim();

  if (!correctPassword) {
    return NextResponse.json({ error: "Senha não configurada no servidor" }, { status: 500 });
  }

  if (password.trim() !== correctPassword) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 dias
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
