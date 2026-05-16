"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

import { computeLabPressToMpa, LabPressToMpaInputSchema, type LabPressToMpaOutput } from "@/lib/calculators/labPressToMpa";
import { parseNumberFR } from "@/lib/forms/numbers";

const SPECIMEN_DIAMETERS_MM = [100, 150, 160];

export function LabPressToMpaCalculator() {
  const [loadKn, setLoadKn] = useState("500");
  const [specimenDiameterMm, setSpecimenDiameterMm] = useState("150");

  const [output, setOutput] = useState<LabPressToMpaOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validateFields() {
    const next: Record<string, string> = {};
    const load = parseNumberFR(loadKn);
    if (load === null) next.loadKn = "Nombre invalide";

    setFieldErrors(next);
    return { ok: Object.keys(next).length === 0, loadKn: load };
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

    const parsed = LabPressToMpaInputSchema.safeParse({
      loadKn: fields.loadKn ?? NaN,
      specimenDiameterMm: parseNumberFR(specimenDiameterMm) ?? NaN,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les valeurs (unités et bornes).");
      return;
    }

    try {
      setOutput(computeLabPressToMpa(parsed.data));
    } catch {
      setOutput(null);
      setError("Calcul impossible avec ces valeurs.");
    }
  }

  function handleReset() {
    setLoadKn("500");
    setSpecimenDiameterMm("150");
    setOutput(null);
    setError(null);
    setFieldErrors({});
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>Conversion charge presse (kN) vers contrainte (MPa).</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <Input
            label="Charge à rupture (kN)"
            value={loadKn}
            onChange={(e) => setLoadKn(e.target.value)}
            error={fieldErrors.loadKn}
          />

          <label className="block">
            <div className="mb-1 text-sm font-semibold text-[var(--app-text)]">Diamètre éprouvette (mm)</div>
            <select
              className="h-11 w-full rounded-xl bg-[var(--app-input-bg)] px-3 text-sm text-[var(--app-text)] ring-1 ring-[var(--app-card-border)] outline-none transition focus:ring-2 focus:ring-[var(--cp-accent)]"
              value={specimenDiameterMm}
              onChange={(e) => setSpecimenDiameterMm(e.target.value)}
            >
              {SPECIMEN_DIAMETERS_MM.map((d) => (
                <option key={d} value={String(d)}>
                  {d}
                </option>
              ))}
            </select>
          </label>

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
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Section :</span> {output.areaMm2} mm²
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Contrainte :</span> {output.stressMpa} MPa
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
