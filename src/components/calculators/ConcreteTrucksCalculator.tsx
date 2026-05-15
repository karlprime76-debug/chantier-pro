"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

import { computeConcreteTrucks, ConcreteTrucksInputSchema, type ConcreteTrucksOutput } from "@/lib/calculators/concreteTrucks";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

type CapacityPreset = 6 | 7 | 8 | 10;

export function ConcreteTrucksCalculator() {
  const [volumeTotalM3, setVolumeTotalM3] = useState("12.5");
  const [truckCapacityM3, setTruckCapacityM3] = useState("7");
  const [wastePercent, setWastePercent] = useState("8");

  const [output, setOutput] = useState<ConcreteTrucksOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  function applyPreset(preset: CapacityPreset) {
    setTruckCapacityM3(String(preset));
  }

  function handleCompute() {
    setError(null);

    const parsed = ConcreteTrucksInputSchema.safeParse({
      volumeTotalM3: toNumber(volumeTotalM3) ?? NaN,
      truckCapacityM3: toNumber(truckCapacityM3) ?? NaN,
      wastePercent: toNumber(wastePercent) ?? 0,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les champs numériques.");
      return;
    }

    try {
      setOutput(computeConcreteTrucks(parsed.data));
    } catch {
      setOutput(null);
      setError("Calcul impossible avec ces valeurs.");
    }
  }

  function handleReset() {
    setVolumeTotalM3("12.5");
    setTruckCapacityM3("7");
    setWastePercent("8");
    setOutput(null);
    setError(null);
  }

  const recommendation = output
    ? `Prévoir ${output.trucksCount} toupie${output.trucksCount > 1 ? "s" : ""} de ${truckCapacityM3} m³ (reste ~${output.remainingM3} m³).`
    : null;

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>Volume total, capacité toupie et marge de perte.</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Volume total de béton (m³)" value={volumeTotalM3} onChange={(e) => setVolumeTotalM3(e.target.value)} />
            <Input label="Perte (%)" value={wastePercent} onChange={(e) => setWastePercent(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Input
              label="Capacité d’une toupie (m³)"
              value={truckCapacityM3}
              onChange={(e) => setTruckCapacityM3(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="ghost" onClick={() => applyPreset(6)}>
                6 m³
              </Button>
              <Button type="button" variant="ghost" onClick={() => applyPreset(7)}>
                7 m³
              </Button>
              <Button type="button" variant="ghost" onClick={() => applyPreset(8)}>
                8 m³
              </Button>
              <Button type="button" variant="ghost" onClick={() => applyPreset(10)}>
                10 m³
              </Button>
            </div>
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
          <CardDescription>Nombre de toupies estimatif.</CardDescription>
        </CardHeader>

        {output ? (
          <div className="grid gap-2 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Volume avec perte:</span> {output.volumeWithWasteM3} m³
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Toupies nécessaires:</span> {output.trucksCount}
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Volume livré:</span> {output.deliveredVolumeM3} m³
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Reste:</span> {output.remainingM3} m³
            </div>
            <div className="pt-2 font-semibold text-[var(--app-text)]">{recommendation}</div>
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            Renseigne les paramètres puis clique sur “Calculer”.
          </div>
        )}
      </Card>

      <div className="text-xs text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">
        Les résultats sont des estimations d’aide au chantier. Ils doivent être vérifiés selon les plans, les normes applicables et les
        conditions réelles du projet.
      </div>
    </div>
  );
}
