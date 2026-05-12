"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function LoginForm({ nextUrl }: { nextUrl?: string }) {
  const next = nextUrl && nextUrl.startsWith("/") ? nextUrl : "/dashboard";

  const [email, setEmail] = useState("");
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

        const res = await signIn("credentials", {
          email,
          password,
          redirect: true,
          callbackUrl: next,
        });

        if (res?.error) {
          setError("Email ou mot de passe incorrect.");
        }

        setLoading(false);
      }}
    >
      <Input
        label="Email"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="pro@entreprise.com"
      />
      <Input
        label="Mot de passe"
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
      />

      <div className="-mt-2">
        <Button href="/forgot-password" variant="ghost" size="sm">
          Mot de passe oublié ?
        </Button>
      </div>

      {error ? <div className="text-sm text-[var(--cp-accent)]">{error}</div> : null}

      <Button type="submit" size="lg" disabled={loading}>
        Se connecter
      </Button>

      <Button href="/register" variant="ghost">
        Pas de compte ? Créer un compte gratuit
      </Button>
    </form>
  );
}
