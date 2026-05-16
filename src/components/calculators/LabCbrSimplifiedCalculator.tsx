"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { parseNumberFR } from "@/lib/forms/numbers";

import { computeLabCbrSimplified, LabCbrSimplifiedInputSchema, type LabCbrSimplifiedOutput } from "@/lib/calculators/labCbrSimplified";

export function LabCbrSimplifiedCalculator() {
  const [cbr25, setCbr25] = useState("12");
  const [cbr5, setCbr5] = useState("15");

  const [output, setOutput] = useState<LabCbrSimplifiedOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validateFields() {
    const next: Record<string, string> = {};
    const v25 = parseNumberFR(cbr25);
    const v5 = parseNumberFR(cbr5);
    if (v25 === null) next.cbr25 = "Nombre invalide";
    if (v5 === null) next.cbr5 = "Nombre invalide";
    setFieldErrors(next);
    return { ok: Object.keys(next).length === 0, v25, v5 };
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

    const parsed = LabCbrSimplifiedInputSchema.safeParse({
      cbr25: fields.v25 ?? NaN,
      cbr5: fields.v5 ?? NaN,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les valeurs (unités et bornes)." );
      return;
    }

    try {
      setOutput(computeLabCbrSimplified(parsed.data));
    } catch {
      setOutput(null);
      setError("Calcul impossible.");
    }
  }

  function handleReset() {
    setCbr25("12");
    setCbr5("15");
    setOutput(null);
    setError(null);
    setFieldErrors({});
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>CBR simplifié : compare CBR 2,5 et CBR 5.</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="CBR à 2,5" value={cbr25} onChange={(e) => setCbr25(e.target.value)} error={fieldErrors.cbr25} />
            <Input label="CBR à 5" value={cbr5} onChange={(e) => setCbr5(e.target.value)} error={fieldErrors.cbr5} />
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
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">CBR 2,5 :</span> {output.cbr25}
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">CBR 5 :</span> {output.cbr5}
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">CBR retenu :</span> {output.cbrRetained}
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
