"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { parseNumberFR } from "@/lib/forms/numbers";

import {
  computeLabFreshDensity,
  LabFreshDensityInputSchema,
  type LabFreshDensityOutput,
} from "@/lib/calculators/labFreshDensity";

export function LabFreshDensityCalculator() {
  const [containerVolumeL, setContainerVolumeL] = useState("7");
  const [emptyContainerMassKg, setEmptyContainerMassKg] = useState("2.2");
  const [filledContainerMassKg, setFilledContainerMassKg] = useState("18.5");

  const [output, setOutput] = useState<LabFreshDensityOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validateFields() {
    const next: Record<string, string> = {};
    const volume = parseNumberFR(containerVolumeL);
    const emptyMass = parseNumberFR(emptyContainerMassKg);
    const filledMass = parseNumberFR(filledContainerMassKg);

    if (volume === null) next.containerVolumeL = "Nombre invalide";
    if (emptyMass === null) next.emptyContainerMassKg = "Nombre invalide";
    if (filledMass === null) next.filledContainerMassKg = "Nombre invalide";

    setFieldErrors(next);
    return { ok: Object.keys(next).length === 0, volume, emptyMass, filledMass };
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

    const parsed = LabFreshDensityInputSchema.safeParse({
      containerVolumeL: fields.volume ?? NaN,
      emptyContainerMassKg: fields.emptyMass ?? NaN,
      filledContainerMassKg: fields.filledMass ?? NaN,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les valeurs (unités et bornes).");
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
    setFieldErrors({});
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>Calcul de la masse volumique (kg/m³) du béton frais.</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <Input
            label="Volume récipient (L)"
            value={containerVolumeL}
            onChange={(e) => setContainerVolumeL(e.target.value)}
            error={fieldErrors.containerVolumeL}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Masse récipient vide (kg)"
              value={emptyContainerMassKg}
              onChange={(e) => setEmptyContainerMassKg(e.target.value)}
              error={fieldErrors.emptyContainerMassKg}
            />
            <Input
              label="Masse récipient rempli (kg)"
              value={filledContainerMassKg}
              onChange={(e) => setFilledContainerMassKg(e.target.value)}
              error={fieldErrors.filledContainerMassKg}
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
