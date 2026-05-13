"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/site-config";

type SubscribeButtonProps = {
  plan: "PREMIUM" | "ENTERPRISE";
  children: string;
  className?: string;
};

export function SubscribeButton({ plan, children, className }: SubscribeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ title: string; details?: string } | null>(null);

  const showTechnicalDetails = process.env.NODE_ENV !== "production";

  return (
    <div className="grid gap-2">
      <Button
        type="button"
        size="lg"
        className={className}
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
              window.location.href = "/login?next=/pricing";
              return;
            }

            const data = (await res.json().catch(() => null)) as
              | { ok: true; redirectUrl: string }
              | { ok: false; error: string; message?: string; details?: string }
              | null;

            if (!res.ok || !data || data.ok !== true) {
              const fallbackTitle = "Impossible de créer le paiement. Veuillez réessayer dans un instant.";

              if (data && "ok" in data && data.ok === false) {
                const title =
                  data.error === "provider_not_configured"
                    ? "Paiement indisponible pour le moment. Contacte-nous pour activer ton abonnement."
                    : data.error === "server_misconfigured"
                      ? "Paiement indisponible pour le moment. Contacte-nous pour finaliser l’activation."
                      : fallbackTitle;
                const details =
                  showTechnicalDetails && typeof data.details === "string" && data.details.trim()
                    ? data.details.trim()
                    : undefined;
                setError({ title, details });
                return;
              }

              setError({ title: fallbackTitle });
              return;
            }

            window.location.href = data.redirectUrl;
          } catch {
            setError({ title: "Impossible de créer le paiement. Veuillez réessayer dans un instant." });
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? "Redirection..." : children}
      </Button>

      {error ? (
        <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-3 text-sm">
          <div className="text-[var(--cp-accent)]">{error.title}</div>
          {error.details ? <div className="mt-1 text-[var(--app-text-muted)]">Détail serveur : {error.details}</div> : null}
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <Button href={SITE_CONFIG.whatsappUrl} target="_blank" rel="noreferrer" size="sm" variant="secondary">
              WhatsApp
            </Button>
            <Button href={`mailto:${SITE_CONFIG.email}`} size="sm" variant="ghost">
              Email
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
