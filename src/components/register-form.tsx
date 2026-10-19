"use client";

import { useState, type FormEvent } from "react";

export default function RegisterForm() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const confirm = String(form.get("confirmPassword") || "");
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      setBusy(false);
      return;
    }
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), password }),
      });
      const data = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) {
        setError(data.error || "Não foi possível criar a conta.");
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
    <label>E-mail administrativo<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
    <label>Senha (mínimo de 14 caracteres)<input name="password" type="password" autoComplete="new-password" minLength={14} maxLength={200} required /></label>
    <label>Confirmar senha<input name="confirmPassword" type="password" autoComplete="new-password" minLength={14} maxLength={200} required /></label>
    {error && <p role="alert" style={{ color: "#b42318" }}>{error}</p>}
    <button className="btn" disabled={busy}>{busy ? "Criando conta…" : "Criar conta administrativa"}</button>
  </form>;
}
