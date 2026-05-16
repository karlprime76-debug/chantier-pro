"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

import {
  computeLabCompactionDegree,
  LabCompactionDegreeInputSchema,
  type LabCompactionDegreeOutput,
} from "@/lib/calculators/labCompactionDegree";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function LabCompactionDegreeCalculator() {
  const [dryDensityKgPerM3, setDryDensityKgPerM3] = useState("1800");
  const [maxDryDensityKgPerM3, setMaxDryDensityKgPerM3] = useState("1950");
  const [thresholdPercent, setThresholdPercent] = useState("95");

  const [output, setOutput] = useState<LabCompactionDegreeOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCompute() {
    setError(null);

    const parsed = LabCompactionDegreeInputSchema.safeParse({
      dryDensityKgPerM3: toNumber(dryDensityKgPerM3) ?? NaN,
      maxDryDensityKgPerM3: toNumber(maxDryDensityKgPerM3) ?? NaN,
      thresholdPercent: toNumber(thresholdPercent) ?? NaN,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les densités et le seuil.");
      return;
    }

    try {
      setOutput(computeLabCompactionDegree(parsed.data));
    } catch {
      setOutput(null);
      setError("Calcul impossible.");
    }
  }

  function handleReset() {
    setDryDensityKgPerM3("1800");
    setMaxDryDensityKgPerM3("1950");
    setThresholdPercent("95");
    setOutput(null);
    setError(null);
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>Degré de compactage (%) = ρd / ρd,max.</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Densité sèche ρd (kg/m³)"
              value={dryDensityKgPerM3}
              onChange={(e) => setDryDensityKgPerM3(e.target.value)}
            />
            <Input
              label="Densité max ρd,max (kg/m³)"
              value={maxDryDensityKgPerM3}
              onChange={(e) => setMaxDryDensityKgPerM3(e.target.value)}
            />
            <Input label="Seuil (%)" value={thresholdPercent} onChange={(e) => setThresholdPercent(e.target.value)} />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={handleCompute}>
              Calculer
            </Button>
            <Button type="button" variant="ghost" onClick={handleReset}>
              Réinitialiser
            </Button>
          </div>

          {error ? <div className="text-sm text-[var(--cp-accent)]">{error}</div> : null}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Résultats</CardTitle>
          <CardDescription>Résultat + conformité au seuil.</CardDescription>
        </CardHeader>

        {output ? (
          <div className="grid gap-2 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Compactage :</span> {output.compactionPercent} %
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Seuil atteint :</span> {output.meetsThreshold ? "Oui" : "Non"}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            Renseigne les paramètres puis clique sur “Calculer”.
          </div>
        )}
      </Card>

      <div className="text-xs text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">
        Ces calculs servent d’aide au contrôle qualité. Les résultats doivent être interprétés selon les normes applicables, les procédures du
        laboratoire et la validation du responsable qualité.
      </div>
    </div>
  );
}
