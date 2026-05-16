"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { parseNumberFR } from "@/lib/forms/numbers";

import { computeLabDryDensity, LabDryDensityInputSchema, type LabDryDensityOutput } from "@/lib/calculators/labDryDensity";

export function LabDryDensityCalculator() {
  const [wetDensityKgPerM3, setWetDensityKgPerM3] = useState("1950");
  const [moisturePercent, setMoisturePercent] = useState("8");

  const [output, setOutput] = useState<LabDryDensityOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validateFields() {
    const next: Record<string, string> = {};
    const wet = parseNumberFR(wetDensityKgPerM3);
    const w = parseNumberFR(moisturePercent);
    if (wet === null) next.wetDensityKgPerM3 = "Nombre invalide";
    if (w === null) next.moisturePercent = "Nombre invalide";
    setFieldErrors(next);
    return { ok: Object.keys(next).length === 0, wet, w };
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

    const parsed = LabDryDensityInputSchema.safeParse({
      wetDensityKgPerM3: fields.wet ?? NaN,
      moisturePercent: fields.w ?? NaN,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les valeurs (unités et bornes)." );
      return;
    }

    try {
      setOutput(computeLabDryDensity(parsed.data));
    } catch {
      setOutput(null);
      setError("Calcul impossible.");
    }
  }

  function handleReset() {
    setWetDensityKgPerM3("1950");
    setMoisturePercent("8");
    setOutput(null);
    setError(null);
    setFieldErrors({});
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>Calcul de la densité sèche à partir de la densité humide et de w%.</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Densité humide (kg/m³)"
              value={wetDensityKgPerM3}
              onChange={(e) => setWetDensityKgPerM3(e.target.value)}
              error={fieldErrors.wetDensityKgPerM3}
            />
            <Input
              label="Humidité w (%)"
              value={moisturePercent}
              onChange={(e) => setMoisturePercent(e.target.value)}
              error={fieldErrors.moisturePercent}
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
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Densité sèche :</span> {output.dryDensityKgPerM3} kg/m³
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
