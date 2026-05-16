"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { parseNumberFR } from "@/lib/forms/numbers";

import { computeLabAtterbergLimits, LabAtterbergLimitsInputSchema, type LabAtterbergLimitsOutput } from "@/lib/calculators/labAtterbergLimits";

export function LabAtterbergLimitsCalculator() {
  const [liquidLimitLL, setLiquidLimitLL] = useState("35");
  const [plasticLimitPL, setPlasticLimitPL] = useState("22");

  const [output, setOutput] = useState<LabAtterbergLimitsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validateFields() {
    const next: Record<string, string> = {};
    const ll = parseNumberFR(liquidLimitLL);
    const pl = parseNumberFR(plasticLimitPL);
    if (ll === null) next.liquidLimitLL = "Nombre invalide";
    if (pl === null) next.plasticLimitPL = "Nombre invalide";
    setFieldErrors(next);
    return { ok: Object.keys(next).length === 0, ll, pl };
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

    const parsed = LabAtterbergLimitsInputSchema.safeParse({
      liquidLimitLL: fields.ll ?? NaN,
      plasticLimitPL: fields.pl ?? NaN,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les valeurs (unités et bornes).");
      return;
    }

    try {
      setOutput(computeLabAtterbergLimits(parsed.data));
    } catch {
      setOutput(null);
      setError("Calcul impossible (LL doit être ≥ PL)." );
    }
  }

  function handleReset() {
    setLiquidLimitLL("35");
    setPlasticLimitPL("22");
    setOutput(null);
    setError(null);
    setFieldErrors({});
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>Limites d’Atterberg : IP = LL - PL (interprétation indicative).</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Limite de liquidité LL (%)"
              value={liquidLimitLL}
              onChange={(e) => setLiquidLimitLL(e.target.value)}
              error={fieldErrors.liquidLimitLL}
            />
            <Input
              label="Limite de plasticité PL (%)"
              value={plasticLimitPL}
              onChange={(e) => setPlasticLimitPL(e.target.value)}
              error={fieldErrors.plasticLimitPL}
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
          <CardDescription>Indice de plasticité + interprétation.</CardDescription>
        </CardHeader>

        {output ? (
          <div className="grid gap-2 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">IP :</span> {output.plasticityIndexIP}
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
