"use client";
import { useState, type FormEvent } from "react";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
      });
      const data = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Não foi possível entrar.");
        setBusy(false);
        return;
      }
      window.location.assign("/admin");
    } catch {
      setError("Falha de conexão. Tente novamente.");
      setBusy(false);
    }
  }
  return <form className="form" onSubmit={submit}>
    <label>E-mail<input name="email" type="email" autoComplete="username" required /></label>
    <label>Senha<input name="password" type="password" autoComplete="current-password" required /></label>
    {error && <p role="alert">{error}</p>}
    <button className="btn" disabled={busy}>{busy ? "Entrando…" : "Entrar"}</button>
  </form>;
}
