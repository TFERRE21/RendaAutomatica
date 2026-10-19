import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
const brl = (cents: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({ where: { slug, status: "ACTIVE" } });
  if (!product) notFound();

  return <>
    <header className="topbar">
      <Link className="brand" href="/">Renda Automática AI</Link>
      <nav><Link href="/">Voltar à loja</Link></nav>
    </header>
    <main className="container">
      <article className="card" style={{ maxWidth: 760, margin: "30px auto" }}>
        <p className="muted">PRODUTO DIGITAL</p>
        <h1>{product.name}</h1>
        <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{product.description}</p>
        <p className="metric">{brl(product.priceCents)}</p>
        {product.checkoutUrl
          ? <a className="btn" href={product.checkoutUrl} target="_blank" rel="noopener noreferrer" style={{ marginTop: 12 }}>Comprar agora</a>
          : <p className="muted">Compra online ainda não configurada para este produto. Volte em breve.</p>}
      </article>
    </main>
  </>;
}
