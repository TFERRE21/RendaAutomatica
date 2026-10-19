import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <>
      <header className="topbar">
        <Link className="brand" href="/">Renda Automática AI</Link>
        <nav><Link href="/">Ver loja</Link></nav>
      </header>
      <main className="container">
        <section style={{ padding: "32px 0 20px" }}>
          <p className="muted">PAINEL ADMINISTRATIVO</p>
          <h1>Olá, {user.email}</h1>
          <p className="muted">Gerencie sua loja e acompanhe a operação.</p>
        </section>
        <section className="grid">
          <article className="card">
            <h2>Produtos digitais</h2>
            <p className="muted">Consulte a loja pública e prepare os produtos que serão publicados.</p>
            <Link className="btn" href="/">Abrir loja</Link>
          </article>
          <article className="card">
            <h2>Configuração</h2>
            <p className="muted">A sessão administrativa está ativa. Os recursos de cadastro, pedidos e entregas precisam ser conectados às rotas correspondentes antes de serem usados em produção.</p>
          </article>
        </section>
      </main>
    </>
  );
}
