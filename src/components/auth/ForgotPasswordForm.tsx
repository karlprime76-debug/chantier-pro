"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const GENERIC_MESSAGE =
  "Si un compte existe avec cet email, un lien de réinitialisation sera envoyé.";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
          await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ email: email.trim().toLowerCase() }),
          });

          setSubmitted(true);
        } catch {
          setSubmitted(true);
        } finally {
          setLoading(false);
        }
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

      {submitted ? (
        <div className="text-sm text-[var(--app-text-muted)]">{GENERIC_MESSAGE}</div>
      ) : error ? (
        <div className="text-sm text-[var(--app-primary)]">{error}</div>
      ) : null}

      <Button type="submit" size="lg" disabled={loading || submitted}>
        Recevoir le lien de réinitialisation
      </Button>

      <Button href="/login" variant="ghost">
        Retour à la connexion
      </Button>
    </form>
  );
}
