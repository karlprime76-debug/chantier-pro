"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { MvpToolShell } from "@/components/calculs/MvpToolShell";

type Line = {
  id: string;
  label: string;
  qty: number;
  unit: string;
  unitPrice: number;
};

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function n(v: string) {
  const x = Number(String(v).replace(",", "."));
  return Number.isFinite(x) ? x : 0;
}

function fmt(v: number) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(v));
}

export default function DevisClient() {
  const [lines, setLines] = useState<Line[]>([
    { id: uid(), label: "Main d’œuvre", qty: 1, unit: "forfait", unitPrice: 0 },
  ]);

  const total = useMemo(() => lines.reduce((s, l) => s + l.qty * l.unitPrice, 0), [lines]);

  return (
    <MvpToolShell title="Devis (MVP)" subtitle="Saisie manuelle + export PDF via impression.">
      <Card>
        <CardHeader>
          <CardTitle>Lignes</CardTitle>
          <CardDescription>Ajoute, modifie et exporte.</CardDescription>
        </CardHeader>

        <div className="grid gap-3 px-6 pb-6">
          {lines.map((l) => (
            <div
              key={l.id}
              className="grid gap-2 rounded-2xl border border-[var(--cp-border)] bg-[color-mix(in_oklab,var(--cp-card),transparent_8%)] p-4 sm:grid-cols-5"
            >
              <Input
                label="Désignation"
                name="label"
                value={l.label}
                onChange={(e) => setLines(lines.map((x) => (x.id === l.id ? { ...x, label: e.target.value } : x)))}
              />
              <Input
                label="Quantité"
                name="qty"
                value={String(l.qty)}
                onChange={(e) => setLines(lines.map((x) => (x.id === l.id ? { ...x, qty: n(e.target.value) } : x)))}
                inputMode="decimal"
              />
              <Input
                label="Unité"
                name="unit"
                value={l.unit}
                onChange={(e) => setLines(lines.map((x) => (x.id === l.id ? { ...x, unit: e.target.value } : x)))}
              />
              <Input
                label="Prix unitaire"
                name="unitPrice"
                value={String(l.unitPrice)}
                onChange={(e) =>
                  setLines(lines.map((x) => (x.id === l.id ? { ...x, unitPrice: n(e.target.value) } : x)))
                }
                inputMode="decimal"
              />
              <div className="flex items-end">
                <Button type="button" size="sm" variant="ghost" onClick={() => setLines(lines.filter((x) => x.id !== l.id))}>
                  Supprimer
                </Button>
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-lg font-extrabold text-[var(--cp-text)]">Total: {fmt(total)} FCFA</div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={() => setLines([...lines, { id: uid(), label: "", qty: 1, unit: "u", unitPrice: 0 }])}
              >
                Ajouter une ligne
              </Button>
              <Button type="button" size="lg" onClick={() => window.print()}>
                Générer PDF
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </MvpToolShell>
  );
}
