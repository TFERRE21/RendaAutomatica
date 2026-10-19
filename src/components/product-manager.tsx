"use client";

import { useState, type FormEvent } from "react";

type Product = { id: string; name: string; slug: string; priceCents: number; status: "DRAFT" | "ACTIVE" | "ARCHIVED"; checkoutUrl: string | null };
const money = (cents: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);

export default function ProductManager() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  async function loadProducts() {
    setError("");
    try {
      const response = await fetch("/api/admin/products", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível carregar os produtos.");
      setProducts(data.products);
      setLoaded(true);
    } catch (e) { setError(e instanceof Error ? e.message : "Falha ao carregar produtos."); }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError(""); setSuccess("");
    const form = new FormData(event.currentTarget);
    const price = String(form.get("price") || "").replace(",", ".");
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"), description: form.get("description"), price,
          checkoutUrl: form.get("checkoutUrl"), status: form.get("status"),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível salvar o produto.");
      setSuccess("Produto cadastrado com sucesso.");
      event.currentTarget.reset();
      await loadProducts();
    } catch (e) { setError(e instanceof Error ? e.message : "Falha ao cadastrar."); }
    finally { setBusy(false); }
  }

  return <div style={{ display: "grid", gap: 24 }}>
    <section className="card">
      <h2>Novo produto digital</h2>
      <p className="muted">Cadastre o material e, se já tiver, informe o link de checkout criado no seu provedor de pagamento.</p>
      <form className="form" onSubmit={submit}>
        <label>Nome do produto<input name="name" required minLength={2} maxLength={120} placeholder="Ex.: Guia de renda extra" /></label>
        <label>Descrição<textarea name="description" required minLength={5} maxLength={10000} rows={4} placeholder="O que o comprador vai receber?" /></label>
        <label>Preço em reais<input name="price" inputMode="decimal" required placeholder="29,90" /></label>
        <label>Link de pagamento (opcional)<input name="checkoutUrl" type="url" placeholder="https://..." /></label>
        <label>Status<select name="status" defaultValue="DRAFT"><option value="DRAFT">Rascunho (não aparece na loja)</option><option value="ACTIVE">Publicado</option></select></label>
        <button className="btn" disabled={busy}>{busy ? "Salvando…" : "Cadastrar produto"}</button>
      </form>
      {error && <p role="alert" style={{ color: "#b42318" }}>{error}</p>}
      {success && <p role="status" style={{ color: "#067647" }}>{success}</p>}
    </section>
    <section className="card">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div><h2>Produtos cadastrados</h2><p className="muted">Veja o status e abra a página pública do produto.</p></div>
        <button className="btn secondary" type="button" onClick={loadProducts}>Atualizar lista</button>
      </div>
      {!loaded && <p className="muted">Clique em “Atualizar lista” para consultar os produtos.</p>}
      {loaded && products.length === 0 && <p className="muted">Nenhum produto cadastrado ainda.</p>}
      {products.map(product => <div key={product.id} style={{ padding: "14px 0", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div><strong>{product.name}</strong><p className="muted" style={{ margin: "5px 0" }}>{money(product.priceCents)} · {product.status === "ACTIVE" ? "Publicado" : product.status === "DRAFT" ? "Rascunho" : "Arquivado"}</p>{product.checkoutUrl ? <a href={product.checkoutUrl} target="_blank" rel="noreferrer" style={{ color: "var(--brand)" }}>Abrir link de pagamento</a> : <span className="muted">Sem link de pagamento</span>}</div>
        <a className="btn secondary" href={`/produto/${product.slug}`} target="_blank" rel="noreferrer">Ver página</a>
      </div>)}
    </section>
  </div>;
}
