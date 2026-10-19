import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import RegisterForm from "@/components/register-form";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  if (await getCurrentUser()) redirect("/admin");
  const hasUsers = (await prisma.user.count()) > 0;

  return <>
    <header className="topbar"><Link className="brand" href="/">Renda Automática AI</Link><nav><Link href="/login">Entrar</Link></nav></header>
    <main className="container">
      <section className="card" style={{ maxWidth: 540, margin: "45px auto" }}>
        <h1>Criar conta administrativa</h1>
        {hasUsers ? <>
          <p className="muted">O cadastro inicial já foi concluído e novas inscrições estão desativadas por segurança.</p>
          <Link className="btn" href="/login">Ir para o login</Link>
        </> : <>
          <p className="muted">Crie a primeira conta para administrar a loja. Por segurança, o cadastro público será fechado após a criação da primeira conta.</p>
          <RegisterForm />
        </>}
      </section>
    </main>
  </>;
}
