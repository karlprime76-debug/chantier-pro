"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";

type BillingHealthResponse = {
  ok: boolean;
  paydunyaConfigured: boolean;
  appUrlConfigured: boolean;
  appUrlDetected: string | null;
  missing: string[];
  provider: "paydunya";
  environment: "server";
  message: string;
};

export function BillingHealthCheck() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BillingHealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-white">
            Vérifier la configuration paiement
          </div>
          <div className="text-xs text-white/60">
            Diagnostic côté serveur (sans exposer de secret)
          </div>
        </div>
        <Button
          type="button"
          disabled={loading}
          onClick={async () => {
            try {
              setLoading(true);
              setError(null);
              setData(null);

              const res = await fetch("/api/billing/health", { method: "GET" });
              const json = (await res.json().catch(() => null)) as
                | BillingHealthResponse
                | { ok?: boolean; error?: string }
                | null;

              if (!res.ok || !json || !("ok" in json)) {
                setError(`Diagnostic indisponible. (status ${res.status})`);
                return;
              }

              if ("provider" in json) {
                setData(json);
                return;
              }

              setError(`Diagnostic indisponible. (status ${res.status})`);
            } catch {
              setError("Diagnostic indisponible. Vérifie ta connexion et réessaie.");
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? "Vérification..." : "Vérifier"}
        </Button>
      </div>

      {error ? <div className="mt-3 text-sm text-[var(--cp-accent)]">{error}</div> : null}

      {data ? (
        <div className="mt-3 grid gap-2 text-sm">
          <div className="text-white">{data.message}</div>
          <div className="text-white/70">
            PayDunya configuré : <span className="text-white">{data.paydunyaConfigured ? "oui" : "non"}</span>
          </div>
          <div className="text-white/70">
            APP_URL détectée : <span className="text-white">{data.appUrlDetected ?? "—"}</span>
          </div>
          {data.missing.length ? (
            <div className="text-white/70">
              Variables manquantes : <span className="text-white">{data.missing.join(", ")}</span>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
