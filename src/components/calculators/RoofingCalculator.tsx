"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

import { computeRoofing, RoofingInputSchema, type RoofingOutput } from "@/lib/calculators/roofing";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function RoofingCalculator() {
  const [buildingLengthM, setBuildingLengthM] = useState("12");
  const [buildingWidthM, setBuildingWidthM] = useState("8");
  const [slopePercent, setSlopePercent] = useState("25");
  const [overhangM, setOverhangM] = useState("0.3");
  const [panelCoverAreaM2, setPanelCoverAreaM2] = useState("3");
  const [wastePercent, setWastePercent] = useState("8");

  const [output, setOutput] = useState<RoofingOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCompute() {
    setError(null);

    const parsed = RoofingInputSchema.safeParse({
      buildingLengthM: toNumber(buildingLengthM) ?? NaN,
      buildingWidthM: toNumber(buildingWidthM) ?? NaN,
      slopePercent: toNumber(slopePercent) ?? 0,
      overhangM: toNumber(overhangM) ?? 0,
      panelCoverAreaM2: toNumber(panelCoverAreaM2) ?? NaN,
      wastePercent: toNumber(wastePercent) ?? 0,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les champs numériques.");
      return;
    }

    try {
      setOutput(computeRoofing(parsed.data));
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
          <CardDescription>Dimensions, pente, débords et rendement tôle/panneau.</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Longueur bâtiment (m)" value={buildingLengthM} onChange={(e) => setBuildingLengthM(e.target.value)} />
            <Input label="Largeur bâtiment (m)" value={buildingWidthM} onChange={(e) => setBuildingWidthM(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Pente (%)" value={slopePercent} onChange={(e) => setSlopePercent(e.target.value)} />
            <Input label="Débords (m)" value={overhangM} onChange={(e) => setOverhangM(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Couverture par tôle/panneau (m²)"
              value={panelCoverAreaM2}
              onChange={(e) => setPanelCoverAreaM2(e.target.value)}
            />
            <Input label="Perte (%)" value={wastePercent} onChange={(e) => setWastePercent(e.target.value)} />
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
          <CardDescription>Surface toiture et quantités.</CardDescription>
        </CardHeader>

        {output ? (
          <div className="grid gap-2 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Surface au sol (avec débords):</span> {output.planAreaM2} m²
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Surface toiture (avec pente + perte):</span> {output.roofAreaM2} m²
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Tôles/panneaux:</span> {output.panelsCount}
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Accessoires:</span> ~{Math.round(output.roofAreaM2 * output.accessoriesFactor)} unités (estimation)
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            Renseigne les paramètres puis clique sur “Calculer”.
          </div>
        )}
      </Card>

      <div className="text-xs text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">
        Les accessoires (vis, faîtières, rives) sont une estimation simple à ajuster selon le type de toiture.
      </div>
    </div>
  );
}
