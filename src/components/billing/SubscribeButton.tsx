"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";

type SubscribeButtonProps = {
  plan: "PREMIUM" | "ENTERPRISE";
  children: string;
};

export function SubscribeButton({ plan, children }: SubscribeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="grid gap-2">
      <Button
        type="button"
        size="lg"
        disabled={loading}
        onClick={async () => {
          try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/billing/checkout", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ plan }),
            });

            if (res.status === 401) {
              window.location.href = "/login?callbackUrl=/pricing";
              return;
            }

            const data = (await res.json().catch(() => null)) as
              | { ok: true; redirectUrl: string }
              | { ok: false; error: string; message?: string }
              | null;

            if (!res.ok || !data || data.ok !== true) {
              const fallback = `Paiement indisponible. Réessaie. (status ${res.status})`;
              setError(
                data && "ok" in data && data.ok === false
                  ? data.message ?? fallback
                  : fallback,
              );
              return;
            }

            window.location.href = data.redirectUrl;
          } catch {
            setError("Paiement indisponible. Vérifie ta connexion et réessaie.");
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? "Redirection..." : children}
      </Button>

      {error ? <div className="text-sm text-[var(--cp-accent)]">{error}</div> : null}
    </div>
  );
}
