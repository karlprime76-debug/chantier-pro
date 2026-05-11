"use client";

import { useMemo } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { MvpToolShell } from "@/components/calculs/MvpToolShell";

type ExportItem = {
  id: string;
  label: string;
  description: string;
  rows: Array<Record<string, string | number>>;
};

function downloadText(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function toCsv(rows: Array<Record<string, string | number>>) {
  const headers = Array.from(
    rows.reduce((s, r) => {
      Object.keys(r).forEach((k) => s.add(k));
      return s;
    }, new Set<string>()),
  );

  const escape = (v: string) => {
    const needs = v.includes(",") || v.includes("\n") || v.includes('"');
    const x = v.replace(/"/g, '""');
    return needs ? `"${x}"` : x;
  };

  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(headers.map((h) => escape(String(r[h] ?? ""))).join(","));
  }
  return lines.join("\n");
}

export default function ExportsAvancesClient() {
  const items: ExportItem[] = useMemo(
    () => [
      {
        id: "sample",
        label: "Données exemple",
        description: "Export CSV (compatible Excel) + impression PDF via navigateur.",
        rows: [
          { date: new Date().toISOString().slice(0, 10), type: "Calcul", nom: "Béton", valeur: 0 },
          { date: new Date().toISOString().slice(0, 10), type: "Dépense", nom: "Ciment", valeur: 0 },
        ],
      },
    ],
    [],
  );

  return (
    <MvpToolShell title="Exports avancés" subtitle="MVP: export CSV + PDF via impression navigateur.">
      <Card>
        <CardHeader>
          <CardTitle>Exports</CardTitle>
          <CardDescription>Sélectionne un export et télécharge.</CardDescription>
        </CardHeader>

        <div className="grid gap-3 px-6 pb-6">
          {items.map((it) => (
            <div
              key={it.id}
              className="rounded-2xl border border-[var(--cp-border)] bg-[color-mix(in_oklab,var(--cp-card),transparent_8%)] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[var(--cp-text)]">{it.label}</div>
                  <div className="mt-1 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_35%)]">{it.description}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      const csv = toCsv(it.rows);
                      downloadText(`chantier-pro_${it.id}.csv`, csv, "text/csv");
                    }}
                  >
                    Export CSV
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      window.print();
                    }}
                  >
                    Export PDF
                  </Button>
                </div>
              </div>

              <div className="mt-3 text-xs text-[color-mix(in_oklab,var(--cp-text),transparent_45%)]">
                Conseil: pour un PDF propre, utilise l’option “Enregistrer en PDF” lors de l’impression.
              </div>
            </div>
          ))}
        </div>
      </Card>
    </MvpToolShell>
  );
}
