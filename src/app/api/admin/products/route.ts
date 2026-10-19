import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function makeSlug(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !["ADMIN", "EDITOR"].includes(user.role)) {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
  }
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || !["ADMIN", "EDITOR"].includes(user.role)) {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
  }

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Preencha os dados do produto." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const description = typeof input.description === "string" ? input.description.trim() : "";
  const price = typeof input.price === "string" || typeof input.price === "number" ? Number(input.price) : NaN;
  const status = input.status === "ACTIVE" ? "ACTIVE" : "DRAFT";
  const checkoutUrl = typeof input.checkoutUrl === "string" ? input.checkoutUrl.trim() : "";

  if (name.length < 2 || name.length > 120) return NextResponse.json({ error: "O nome deve ter entre 2 e 120 caracteres." }, { status: 400 });
  if (description.length < 5 || description.length > 10000) return NextResponse.json({ error: "A descrição deve ter entre 5 e 10.000 caracteres." }, { status: 400 });
  if (!Number.isFinite(price) || price < 0.01 || price > 1000000) return NextResponse.json({ error: "Informe um preço válido." }, { status: 400 });
  if (checkoutUrl) {
    try {
      const parsed = new URL(checkoutUrl);
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error("invalid protocol");
    } catch {
      return NextResponse.json({ error: "O link de pagamento precisa ser uma URL válida iniciada por https://." }, { status: 400 });
    }
  }

  const baseSlug = makeSlug(name) || "produto";
  let slug = baseSlug;
  for (let suffix = 2; await prisma.product.findUnique({ where: { slug }, select: { id: true } }); suffix++) {
    slug = `${baseSlug}-${suffix}`;
  }

  try {
    const product = await prisma.product.create({
      data: {
        name, description, slug, priceCents: Math.round(price * 100),
        checkoutUrl: checkoutUrl || null, status,
      },
    });
    await prisma.auditLog.create({
      data: { userId: user.id, action: "product.created", entityType: "Product", entityId: product.id, metadata: { slug, status } },
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Já existe um produto com esses dados. Tente novamente." }, { status: 409 });
    }
    console.error("Erro ao criar produto", error);
    return NextResponse.json({ error: "Não foi possível salvar o produto." }, { status: 500 });
  }
}
