"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { parseNumberFR } from "@/lib/forms/numbers";

import { computeLabSlumpAbrams, LabSlumpAbramsInputSchema, type LabSlumpAbramsOutput } from "@/lib/calculators/labSlumpAbrams";

export function LabSlumpAbramsCalculator() {
  const [coneHeightMm, setConeHeightMm] = useState("300");
  const [measuredHeightMm, setMeasuredHeightMm] = useState("220");

  const [output, setOutput] = useState<LabSlumpAbramsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validateFields() {
    const next: Record<string, string> = {};
    const cone = parseNumberFR(coneHeightMm);
    const measured = parseNumberFR(measuredHeightMm);
    if (cone === null) next.coneHeightMm = "Nombre invalide";
    if (measured === null) next.measuredHeightMm = "Nombre invalide";
    setFieldErrors(next);
    return { ok: Object.keys(next).length === 0, cone, measured };
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

    const parsed = LabSlumpAbramsInputSchema.safeParse({
      coneHeightMm: fields.cone ?? NaN,
      measuredHeightMm: fields.measured ?? NaN,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les valeurs (unités et bornes).");
      return;
    }

    try {
      setOutput(computeLabSlumpAbrams(parsed.data));
    } catch {
      setOutput(null);
      setError("Calcul impossible (hauteurs incohérentes).");
    }
  }

  function handleReset() {
    setConeHeightMm("300");
    setMeasuredHeightMm("220");
    setOutput(null);
    setError(null);
    setFieldErrors({});
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>Affaissement du béton au cône d’Abrams (mm).</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Hauteur cône (mm)"
              value={coneHeightMm}
              onChange={(e) => setConeHeightMm(e.target.value)}
              error={fieldErrors.coneHeightMm}
            />
            <Input
              label="Hauteur mesurée (mm)"
              value={measuredHeightMm}
              onChange={(e) => setMeasuredHeightMm(e.target.value)}
              error={fieldErrors.measuredHeightMm}
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
          <CardDescription>Résultat + interprétation indicative.</CardDescription>
        </CardHeader>

        {output ? (
          <div className="grid gap-2 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Affaissement :</span> {output.slumpMm} mm
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Interprétation :</span> {output.interpretation}
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
