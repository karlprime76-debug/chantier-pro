"use client";

import { useState } from "react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

import { computeSteelWeight, SteelWeightInputSchema, type SteelWeightOutput } from "@/lib/calculators/steelWeight";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function SteelWeightCalculator() {
  const [diameterMm, setDiameterMm] = useState("12");
  const [totalLengthM, setTotalLengthM] = useState("60");
  const [barsCount, setBarsCount] = useState("");
  const [lengthPerBarM, setLengthPerBarM] = useState("");

  const [output, setOutput] = useState<SteelWeightOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCompute() {
    setError(null);

    const parsed = SteelWeightInputSchema.safeParse({
      diameterMm: toNumber(diameterMm) ?? NaN,
      totalLengthM: toNumber(totalLengthM) ?? NaN,
      barsCount: barsCount.trim() ? Number(barsCount) : undefined,
      lengthPerBarM: lengthPerBarM.trim() ? Number(lengthPerBarM) : undefined,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les champs numériques.");
      return;
    }

    try {
      setOutput(computeSteelWeight(parsed.data));
    } catch {
      setOutput(null);
      setError("Calcul impossible avec ces valeurs.");
    }
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>Poids acier selon diamètre et longueur.</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Diamètre (mm)" value={diameterMm} onChange={(e) => setDiameterMm(e.target.value)} />
            <Input label="Longueur totale (m)" value={totalLengthM} onChange={(e) => setTotalLengthM(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nombre de barres (optionnel)" value={barsCount} onChange={(e) => setBarsCount(e.target.value)} />
            <Input
              label="Longueur par barre (m, optionnel)"
              value={lengthPerBarM}
              onChange={(e) => setLengthPerBarM(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Button type="button" variant="secondary" onClick={handleCompute}>
              Calculer
            </Button>
          </div>

          {error ? <div className="text-sm text-[var(--cp-accent)]">{error}</div> : null}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Résultats</CardTitle>
          <CardDescription>Formule: kg/m = diamètre² / 162.</CardDescription>
        </CardHeader>

        {output ? (
          <div className="grid gap-2 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Poids linéaire:</span> {output.kgPerMeter} kg/m
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Poids total:</span> {output.totalWeightKg} kg
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Poids par barre:</span> {output.weightPerBarKg === null ? "—" : `${output.weightPerBarKg} kg`}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            Renseigne les paramètres puis clique sur “Calculer”.
          </div>
        )}
      </Card>
    </div>
  );
}
