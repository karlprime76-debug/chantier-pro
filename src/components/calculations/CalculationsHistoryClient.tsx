"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

type HistoryItem = {
  kind: "concrete" | "steel" | "stair_straight";
  id: string;
  createdAt: string;
  projectId: string;
  title: string;
  summary: string;
  reopenHref: string;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("fr-FR");
}

export function CalculationsHistoryClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<HistoryItem[]>([]);

  async function refresh() {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/calculations/history");
    const data = (await res.json().catch(() => null)) as
      | { ok: true; items: HistoryItem[] }
      | { ok: false; error: string }
      | null;

    if (!res.ok || !data || data.ok !== true) {
      setItems([]);
      setError("Impossible de charger l’historique.");
      setLoading(false);
      return;
    }

    setItems(data.items);
    setLoading(false);
  }

  useEffect(() => {
    const t = setTimeout(() => {
      void refresh();
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const emptyLabel = useMemo(() => {
    if (loading) return "Chargement…";
    if (error) return error;
    return "Aucun calcul sauvegardé pour le moment.";
  }, [loading, error]);

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-[var(--app-text)]">Calculs sauvegardés</div>
          <div className="mt-1 text-xs text-[var(--app-text-muted)]">Béton / Acier / Escalier droit (MVP).</div>
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={() => void refresh()} disabled={loading}>
          Actualiser
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
          {emptyLabel}
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((it) => (
            <Card key={`${it.kind}:${it.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <CardTitle>{it.title}</CardTitle>
                    <CardDescription>
                      {formatDate(it.createdAt)} · {it.summary}
                    </CardDescription>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <Button href={it.reopenHref} variant="secondary" size="sm">
                      Réouvrir
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        const res = await fetch(
                          `/api/calculations/history?kind=${encodeURIComponent(it.kind)}&id=${encodeURIComponent(it.id)}`,
                          { method: "DELETE" },
                        );
                        if (res.ok) {
                          await refresh();
                        }
                      }}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-xs text-[var(--app-text-muted)]">
        <div className="font-semibold text-[var(--app-text)]">Limites MVP</div>
        <div>
          L’historique global n’affiche pas encore les calculateurs blocs/peinture/carrelage/dalle avancée (ils seront ajoutés ensuite).
        </div>
      </div>
    </div>
  );
}
