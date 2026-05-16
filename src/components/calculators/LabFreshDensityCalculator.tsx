"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

import {
  computeLabFreshDensity,
  LabFreshDensityInputSchema,
  type LabFreshDensityOutput,
} from "@/lib/calculators/labFreshDensity";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function LabFreshDensityCalculator() {
  const [containerVolumeL, setContainerVolumeL] = useState("7");
  const [emptyContainerMassKg, setEmptyContainerMassKg] = useState("2.2");
  const [filledContainerMassKg, setFilledContainerMassKg] = useState("18.5");

  const [output, setOutput] = useState<LabFreshDensityOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCompute() {
    setError(null);

    const parsed = LabFreshDensityInputSchema.safeParse({
      containerVolumeL: toNumber(containerVolumeL) ?? NaN,
      emptyContainerMassKg: toNumber(emptyContainerMassKg) ?? NaN,
      filledContainerMassKg: toNumber(filledContainerMassKg) ?? NaN,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les masses et le volume.");
      return;
    }

    try {
      setOutput(computeLabFreshDensity(parsed.data));
    } catch {
      setOutput(null);
      setError("Calcul impossible (masse/volume incohérents).");
    }
  }

  function handleReset() {
    setContainerVolumeL("7");
    setEmptyContainerMassKg("2.2");
    setFilledContainerMassKg("18.5");
    setOutput(null);
    setError(null);
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>Calcul de la masse volumique (kg/m³) du béton frais.</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <Input label="Volume récipient (L)" value={containerVolumeL} onChange={(e) => setContainerVolumeL(e.target.value)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Masse récipient vide (kg)"
              value={emptyContainerMassKg}
              onChange={(e) => setEmptyContainerMassKg(e.target.value)}
            />
            <Input
              label="Masse récipient rempli (kg)"
              value={filledContainerMassKg}
              onChange={(e) => setFilledContainerMassKg(e.target.value)}
            />
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
          <CardDescription>Valeurs indicatives.</CardDescription>
        </CardHeader>

        {output ? (
          <div className="grid gap-2 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Masse béton :</span> {output.concreteMassKg} kg
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Volume :</span> {output.volumeM3} m³
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Masse volumique :</span> {output.densityKgPerM3} kg/m³
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
