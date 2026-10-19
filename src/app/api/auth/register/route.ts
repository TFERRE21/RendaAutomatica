import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Preencha e-mail e senha." }, { status: 400 });
  }
  const input = body as Record<string, unknown>;
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = typeof input.password === "string" ? input.password : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
  }
  if (password.length < 14 || password.length > 200) {
    return NextResponse.json({ error: "A senha precisa ter entre 14 e 200 caracteres." }, { status: 400 });
  }

  try {
    // Public registration is permitted only for initial setup, when no account exists.
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      return NextResponse.json({ error: "O cadastro público está fechado porque já existe uma conta. Entre com a conta administrativa." }, { status: 403 });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, passwordHash, role: "ADMIN", active: true },
      select: { id: true, email: true },
    });
    await createSession(user.id);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Falha no cadastro inicial de administrador", error);
    return NextResponse.json({ error: "Não foi possível criar a conta. Tente entrar ou verifique os logs." }, { status: 500 });
  }
}
