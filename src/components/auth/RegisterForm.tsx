"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const normalizedEmail = email.trim().toLowerCase();

        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ name, email: normalizedEmail, company, password }),
        });

        const data = (await res.json().catch(() => null)) as
          | { ok: true; userId: string }
          | { ok: false; error: string; issues?: Array<{ path: Array<string | number>; message: string }>; message?: string }
          | null;

        if (!res.ok) {
          if (data?.ok === false) {
            if (data.error === "email_already_used") {
              setError("Cet email est déjà utilisé. Connecte-toi ou utilise un autre email.");
            } else if (data.error === "invalid_payload") {
              const details = (data.issues ?? [])
                .map((i) => `${i.path.join(".") || "champ"}: ${i.message}`)
                .slice(0, 3)
                .join(" • ");
              setError(details ? `Inscription impossible. ${details}` : "Inscription impossible. Vérifie tes infos.");
            } else if (data.error === "server_error") {
              setError(
                data.message
                  ? `Inscription impossible (serveur). ${data.message}`
                  : "Inscription impossible (serveur). Réessaie.",
              );
            } else {
              setError("Inscription impossible. Vérifie tes infos.");
            }
          } else {
            setError("Inscription impossible. Vérifie tes infos.");
          }
          setLoading(false);
          return;
        }

        if (!data || data.ok !== true) {
          setError("Inscription impossible. Réessaie.");
          setLoading(false);
          return;
        }

        const result = await signIn("credentials", {
          email: normalizedEmail,
          password,
          redirect: false,
        });

        if (!result || result.error) {
          setError("Compte créé, mais connexion automatique impossible. Connecte-toi manuellement.");
          setLoading(false);
          return;
        }

        window.location.href = "/dashboard";
      }}
    >
      <Input
        label="Nom complet"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ex: Karim Dossou"
      />
      <Input
        label="Email"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="pro@entreprise.com"
      />
      <Input
        label="Société"
        name="company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Ex: Dossou Construction"
      />
      <Input
        label="Mot de passe"
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
      />

      {error ? <div className="text-sm text-[var(--cp-accent)]">{error}</div> : null}

      <Button type="submit" size="lg" disabled={loading}>
        Créer mon compte
      </Button>

      <Button href="/login" variant="ghost">
        Déjà un compte ? Se connecter
      </Button>
    </form>
  );
}
