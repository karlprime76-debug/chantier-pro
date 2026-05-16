"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { parseNumberFR } from "@/lib/forms/numbers";

import { computeLabCompressiveStrength, LabCompressiveStrengthInputSchema, type LabCompressiveStrengthOutput } from "@/lib/calculators/labCompressiveStrength";

function buildDefaultValues() {
  return ["25", "27", "26"]; 
}

export function LabCompressiveStrengthCalculator() {
  const [values, setValues] = useState<string[]>(buildDefaultValues());
  const [output, setOutput] = useState<LabCompressiveStrengthOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parsedNumbers = useMemo(
    () => values.map((v) => parseNumberFR(v)).filter((v): v is number => v !== null),
    [values],
  );

  const rowErrors = useMemo(() => {
    return values.map((v) => {
      if (!v.trim()) return undefined;
      return parseNumberFR(v) === null ? "Nombre invalide" : undefined;
    });
  }, [values]);

  function handleCompute() {
    setError(null);

    const parsed = LabCompressiveStrengthInputSchema.safeParse({
      strengthsMpa: parsedNumbers,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Ajoute au moins 1 valeur MPa valide.");
      return;
    }

    try {
      setOutput(computeLabCompressiveStrength(parsed.data));
    } catch {
      setOutput(null);
      setError("Calcul impossible avec ces valeurs.");
    }
  }

  function handleReset() {
    setValues(buildDefaultValues());
    setOutput(null);
    setError(null);
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>Entre 1 et 12 valeurs (MPa) puis calcule.</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-3">
            {values.map((v, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_auto] items-end gap-2">
                <Input
                  label={`Éprouvette ${idx + 1} (MPa)`}
                  value={v}
                  onChange={(e) => {
                    const next = [...values];
                    next[idx] = e.target.value;
                    setValues(next);
                  }}
                  error={rowErrors[idx]}
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    const next = values.filter((_, i) => i !== idx);
                    setValues(next.length === 0 ? [""] : next);
                  }}
                  disabled={values.length <= 1}
                >
                  Retirer
                </Button>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                if (values.length >= 12) return;
                setValues([...values, ""]);
              }}
              disabled={values.length >= 12}
            >
              Ajouter une éprouvette
            </Button>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" onClick={handleCompute}>
                Calculer
              </Button>
              <Button type="button" variant="ghost" onClick={handleReset}>
                Réinitialiser
              </Button>
            </div>
          </div>

          {error ? <div className="text-sm text-[var(--cp-accent)]">{error}</div> : null}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Résultats</CardTitle>
          <CardDescription>Indicateurs (moyenne, dispersion).</CardDescription>
        </CardHeader>

        {output ? (
          <div className="grid gap-2 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Nombre :</span> {output.count}
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Moyenne :</span> {output.averageMpa} MPa
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Min / Max :</span> {output.minMpa} / {output.maxMpa} MPa
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Écart (max-min) :</span> {output.rangeMpa} MPa
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Écart max à la moyenne :</span> {output.maxDeviationFromAverageMpa} MPa
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            Renseigne les valeurs puis clique sur “Calculer”.
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
