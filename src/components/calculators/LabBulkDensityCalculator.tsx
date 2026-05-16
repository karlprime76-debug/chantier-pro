"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { parseNumberFR } from "@/lib/forms/numbers";

import { computeLabBulkDensity, LabBulkDensityInputSchema, type LabBulkDensityOutput } from "@/lib/calculators/labBulkDensity";

export function LabBulkDensityCalculator() {
  const [containerVolumeL, setContainerVolumeL] = useState("10");
  const [netMassKg, setNetMassKg] = useState("16");

  const [output, setOutput] = useState<LabBulkDensityOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validateFields() {
    const next: Record<string, string> = {};
    const volume = parseNumberFR(containerVolumeL);
    const mass = parseNumberFR(netMassKg);
    if (volume === null) next.containerVolumeL = "Nombre invalide";
    if (mass === null) next.netMassKg = "Nombre invalide";
    setFieldErrors(next);
    return { ok: Object.keys(next).length === 0, volume, mass };
  }

  function handleCompute() {
    setError(null);
    setFieldErrors({});

    const fields = validateFields();
    if (!fields.ok) {
      setOutput(null);
      setError("Corrige les champs en erreur.");
      return;
    }

    const parsed = LabBulkDensityInputSchema.safeParse({
      containerVolumeL: fields.volume ?? NaN,
      netMassKg: fields.mass ?? NaN,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les valeurs (unités et bornes).");
      return;
    }

    try {
      setOutput(computeLabBulkDensity(parsed.data));
    } catch {
      setOutput(null);
      setError("Calcul impossible.");
    }
  }

  function handleReset() {
    setContainerVolumeL("10");
    setNetMassKg("16");
    setOutput(null);
    setError(null);
    setFieldErrors({});
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>Masse volumique apparente (granulats/sol) en kg/m³.</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Volume récipient (L)"
              value={containerVolumeL}
              onChange={(e) => setContainerVolumeL(e.target.value)}
              error={fieldErrors.containerVolumeL}
            />
            <Input label="Masse nette (kg)" value={netMassKg} onChange={(e) => setNetMassKg(e.target.value)} error={fieldErrors.netMassKg} />
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
