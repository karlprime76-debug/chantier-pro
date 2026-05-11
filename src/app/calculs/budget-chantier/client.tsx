"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { MvpToolShell } from "@/components/calculs/MvpToolShell";

function n(v: string) {
  const x = Number(String(v).replace(",", "."));
  return Number.isFinite(x) ? x : 0;
}

function fmt(v: number) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(v));
}

export default function BudgetChantierClient() {
  const [budgetInitial, setBudgetInitial] = useState("0");
  const [depenses, setDepenses] = useState("0");

  const computed = useMemo(() => {
    const b = n(budgetInitial);
    const d = n(depenses);
    const reste = b - d;
    const pct = b > 0 ? (d / b) * 100 : 0;
    const depassement = d > b;
    return { reste, pct, depassement };
  }, [budgetInitial, depenses]);

  return (
    <MvpToolShell title="Suivi budget chantier" subtitle="MVP: budget initial + dépenses (saisie manuelle).">
      <Card>
        <CardHeader>
          <CardTitle>Entrées</CardTitle>
          <CardDescription>Renseigne ton budget et les dépenses cumulées.</CardDescription>
        </CardHeader>
        <div className="grid gap-3 px-6 pb-6 sm:grid-cols-2">
          <Input
            label="Budget initial (FCFA)"
            name="budget"
            value={budgetInitial}
            onChange={(e) => setBudgetInitial(e.target.value)}
            inputMode="decimal"
          />
          <Input
            label="Dépenses (FCFA)"
            name="depenses"
            value={depenses}
            onChange={(e) => setDepenses(e.target.value)}
            inputMode="decimal"
          />

          <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              size="lg"
              variant="secondary"
              onClick={() => {
                setBudgetInitial("0");
                setDepenses("0");
              }}
            >
              Réinitialiser
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Résumé</CardTitle>
            <CardDescription>Indicateurs simples.</CardDescription>
          </CardHeader>
          <div className="grid gap-2 px-6 pb-6 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[color-mix(in_oklab,var(--cp-text),transparent_35%)]">Reste</span>
              <span className="font-bold text-[var(--cp-text)]">{fmt(computed.reste)} FCFA</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[color-mix(in_oklab,var(--cp-text),transparent_35%)]">Consommé</span>
              <span className="font-bold text-[var(--cp-text)]">{computed.pct.toFixed(1)}%</span>
            </div>
            {computed.depassement ? (
              <div className="mt-2 rounded-2xl border border-[var(--cp-border)] bg-[color-mix(in_oklab,var(--cp-card),transparent_8%)] p-3 text-sm text-[var(--cp-accent)]">
                Attention: budget dépassé.
              </div>
            ) : null}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conseil</CardTitle>
            <CardDescription>Lecture rapide.</CardDescription>
          </CardHeader>
          <div className="px-6 pb-6 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_25%)]">
            Mets à jour les dépenses régulièrement pour éviter les dépassements.
          </div>
        </Card>
      </div>
    </MvpToolShell>
  );
}
