import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import LoginForm from "@/components/login-form";

export const dynamic = "force-dynamic";
export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/admin");
  return <>
    <header className="topbar"><Link className="brand" href="/">Renda Automática AI</Link></header>
    <main className="container">
      <section className="card" style={{ maxWidth: 520, margin: "45px auto" }}>
        <h1>Entrar no painel</h1>
        <p className="muted">Acesso administrativo protegido.</p>
        <LoginForm />
        <p className="muted" style={{ marginTop: 18 }}>Primeiro acesso? <Link href="/cadastro" style={{ color: "var(--brand)", fontWeight: 700 }}>Criar conta administrativa</Link></p>
      </section>
    </main>
  </>;
}
