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

export default function RentabiliteChantierClient() {
  const [budgetPrevu, setBudgetPrevu] = useState("0");
  const [depensesReelles, setDepensesReelles] = useState("0");
  const [montantFacture, setMontantFacture] = useState("0");

  const computed = useMemo(() => {
    const b = n(budgetPrevu);
    const d = n(depensesReelles);
    const f = n(montantFacture);

    const margeBrute = f - d;
    const beneficeEstime = f - d;
    const tauxRentabilite = f > 0 ? (beneficeEstime / f) * 100 : 0;
    const resteAEngager = b - d;

    return { margeBrute, beneficeEstime, tauxRentabilite, resteAEngager };
  }, [budgetPrevu, depensesReelles, montantFacture]);

  return (
    <MvpToolShell title="Rentabilité chantier" subtitle="MVP: calcul instantané (saisie manuelle).">
      <Card>
        <CardHeader>
          <CardTitle>Entrées</CardTitle>
          <CardDescription>Renseigne budget, dépenses et montant facturé.</CardDescription>
        </CardHeader>
        <div className="grid gap-3 px-6 pb-6 sm:grid-cols-3">
          <Input
            label="Budget prévu (FCFA)"
            name="budgetPrevu"
            value={budgetPrevu}
            onChange={(e) => setBudgetPrevu(e.target.value)}
            inputMode="decimal"
          />
          <Input
            label="Dépenses réelles (FCFA)"
            name="depensesReelles"
            value={depensesReelles}
            onChange={(e) => setDepensesReelles(e.target.value)}
            inputMode="decimal"
          />
          <Input
            label="Montant facturé (FCFA)"
            name="montantFacture"
            value={montantFacture}
            onChange={(e) => setMontantFacture(e.target.value)}
            inputMode="decimal"
          />

          <div className="sm:col-span-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              size="lg"
              variant="secondary"
              onClick={() => {
                setBudgetPrevu("0");
                setDepensesReelles("0");
                setMontantFacture("0");
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
            <CardTitle>Résultats</CardTitle>
            <CardDescription>Estimation rapide.</CardDescription>
          </CardHeader>
          <div className="grid gap-2 px-6 pb-6 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[color-mix(in_oklab,var(--cp-text),transparent_35%)]">Marge brute</span>
              <span className="font-bold text-[var(--cp-text)]">{fmt(computed.margeBrute)} FCFA</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[color-mix(in_oklab,var(--cp-text),transparent_35%)]">Bénéfice estimé</span>
              <span className="font-bold text-[var(--cp-text)]">{fmt(computed.beneficeEstime)} FCFA</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[color-mix(in_oklab,var(--cp-text),transparent_35%)]">Taux de rentabilité</span>
              <span className="font-bold text-[var(--cp-text)]">{computed.tauxRentabilite.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[color-mix(in_oklab,var(--cp-text),transparent_35%)]">Reste à engager</span>
              <span className="font-bold text-[var(--cp-text)]">{fmt(computed.resteAEngager)} FCFA</span>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lecture</CardTitle>
            <CardDescription>Repères simples.</CardDescription>
          </CardHeader>
          <div className="px-6 pb-6 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_25%)]">
            <div>
              - Si la marge est négative, le chantier est potentiellement en perte.
              <br />
              - Le reste à engager compare le budget prévu aux dépenses déjà réalisées.
            </div>
          </div>
        </Card>
      </div>
    </MvpToolShell>
  );
}
