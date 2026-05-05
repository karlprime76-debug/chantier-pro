"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordSuggestion } from "@/components/auth/PasswordSuggestion";

export function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const missingToken = useMemo(() => !token, [token]);

  const validationError = useMemo(() => {
    if (success) return null;
    if (missingToken) return "Lien de réinitialisation manquant.";
    if (!password) return null;
    if (password.length < 8) return "Le mot de passe doit contenir au moins 8 caractères.";
    if (confirm && password !== confirm) return "Les mots de passe ne correspondent pas.";
    return null;
  }, [confirm, missingToken, password, success]);

  return (
    <form
      className="grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault();

        if (missingToken) {
          setError("Lien de réinitialisation manquant.");
          return;
        }

        if (password.length < 8) {
          setError("Le mot de passe doit contenir au moins 8 caractères.");
          return;
        }

        if (password !== confirm) {
          setError("Les mots de passe ne correspondent pas.");
          return;
        }

        setLoading(true);
        setError(null);

        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ token, password }),
        });

        const data = (await res.json().catch(() => null)) as
          | { ok: true; message: string }
          | { ok: false; message: string }
          | null;

        if (!res.ok || !data || data.ok !== true) {
          setError(data?.message ?? "Impossible de réinitialiser le mot de passe.");
          setLoading(false);
          return;
        }

        setSuccess(true);
        setLoading(false);
      }}
    >
      <PasswordSuggestion
        onUse={(suggestion: string) => {
          setPassword(suggestion);
          setConfirm(suggestion);
        }}
      />

      <Input
        label="Nouveau mot de passe"
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
      />

      <Input
        label="Confirmer le mot de passe"
        type="password"
        name="confirm"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="••••••••"
      />

      {validationError ? <div className="text-sm text-[var(--cp-accent)]">{validationError}</div> : null}
      {error ? <div className="text-sm text-[var(--cp-accent)]">{error}</div> : null}

      {success ? (
        <>
          <div className="text-sm text-white/70">Votre mot de passe a été réinitialisé.</div>
          <Button href="/login" size="lg">
            Se connecter
          </Button>
        </>
      ) : (
        <Button type="submit" size="lg" disabled={loading}>
          Réinitialiser mon mot de passe
        </Button>
      )}

      <Button href="/login" variant="ghost">
        Retour à la connexion
      </Button>
    </form>
  );
}
