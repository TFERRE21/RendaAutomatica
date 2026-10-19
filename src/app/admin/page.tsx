import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import ProductManager from "@/components/product-manager";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <>
    <header className="topbar">
      <Link className="brand" href="/">Renda Automática AI</Link>
      <nav><Link href="/">Ver loja</Link></nav>
    </header>
    <main className="container">
      <section style={{ padding: "20px 0" }}>
        <p className="muted">PAINEL ADMINISTRATIVO</p>
        <h1>Olá, {user.email}</h1>
        <p className="muted">Cadastre produtos digitais, defina preços e associe links de pagamento.</p>
      </section>
      <ProductManager />
      <p className="muted" style={{ marginTop: 22, fontSize: 13 }}>Nota: informar um link de checkout não ativa a confirmação automática de pagamento nem a entrega automática. Essas integrações precisam ser configuradas separadamente.</p>
    </main>
  </>;
}
