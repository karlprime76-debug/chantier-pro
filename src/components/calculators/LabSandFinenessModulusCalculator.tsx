"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

import {
  computeLabSandFinenessModulus,
  LabSandFinenessModulusInputSchema,
  type LabSandFinenessModulusOutput,
} from "@/lib/calculators/labSandFinenessModulus";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function buildDefault() {
  return ["10", "25", "45", "65", "80", "92"];
}

export function LabSandFinenessModulusCalculator() {
  const [values, setValues] = useState<string[]>(buildDefault());
  const [output, setOutput] = useState<LabSandFinenessModulusOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parsed = useMemo(() => values.map((v) => toNumber(v)).filter((v): v is number => v !== null), [values]);

  function handleCompute() {
    setError(null);

    const parsedInput = LabSandFinenessModulusInputSchema.safeParse({
      retainedCumulativePercents: parsed,
    });

    if (!parsedInput.success) {
      setOutput(null);
      setError("Renseigne au moins 3 valeurs de retenu cumulé (%)." );
      return;
    }

    try {
      setOutput(computeLabSandFinenessModulus(parsedInput.data));
    } catch {
      setOutput(null);
      setError("Calcul impossible avec ces valeurs.");
    }
  }

  function handleReset() {
    setValues(buildDefault());
    setOutput(null);
    setError(null);
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>
            Saisis les <b>retenus cumulés</b> (%) sur les tamis de référence, puis calcule le MF.
          </CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-3">
            {values.map((v, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_auto] items-end gap-2">
                <Input
                  label={`Retenu cumulé ${idx + 1} (%)`}
                  value={v}
                  onChange={(e) => {
                    const next = [...values];
                    next[idx] = e.target.value;
                    setValues(next);
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setValues(values.filter((_, i) => i !== idx))}
                  disabled={values.length <= 3}
                >
                  Retirer
                </Button>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              if (values.length >= 10) return;
              setValues([...values, ""]);
            }}
            disabled={values.length >= 10}
          >
            Ajouter une valeur
          </Button>

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
          <CardDescription>Module de finesse + interprétation indicative.</CardDescription>
        </CardHeader>

        {output ? (
          <div className="grid gap-2 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">MF :</span> {output.finenessModulus}
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
