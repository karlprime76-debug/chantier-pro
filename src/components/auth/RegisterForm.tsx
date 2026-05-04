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

        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ name, email, company, password }),
        });

        if (!res.ok) {
          setError("Inscription impossible. Vérifie tes infos.");
          setLoading(false);
          return;
        }

        await signIn("credentials", {
          email,
          password,
          redirect: true,
          callbackUrl: "/dashboard",
        });

        setLoading(false);
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
