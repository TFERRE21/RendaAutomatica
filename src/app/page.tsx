import Link from "next/link";
import type { Route } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
const brl = (cents: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);

export default async function Home() {
  const products = await prisma.product.findMany({ where: { status: "ACTIVE" }, orderBy: { createdAt: "desc" }, take: 12 });
  return <><header className="topbar"><Link className="brand" href="/">Renda Automática AI</Link><nav><Link href="/login">Área administrativa</Link></nav></header><main className="container"><section style={{ padding: "38px 0 30px" }}><p className="muted">PRODUTOS DIGITAIS</p><h1 style={{ fontSize: "clamp(30px,5vw,48px)", letterSpacing: "-1.5px", margin: "8px 0 14px" }}>Conhecimento que vira resultado.</h1><p className="muted">Materiais digitais disponíveis para compra e acesso online.</p></section><section className="grid">{products.length ? products.map(p => <article className="card" key={p.id}><p className="muted">Produto digital</p><h2 className="product-title">{p.name}</h2><p className="muted">{p.description}</p><div className="metric">{brl(p.priceCents)}</div><Link className="btn" style={{ marginTop: 18 }} href={`/produto/${p.slug}` as Route}>Ver produto</Link></article>) : <article className="card"><h2>A loja está sendo preparada</h2><p className="muted">Novos produtos serão exibidos aqui quando publicados pelo administrador.</p></article>}</section></main></>;
}
