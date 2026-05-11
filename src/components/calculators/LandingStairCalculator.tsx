"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

import {
  computeLandingStair,
  LandingStairInputSchema,
  type LandingStairOutput,
} from "@/lib/calculators/landingStair";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function LandingStairCalculator() {
  const [totalHeightM, setTotalHeightM] = useState("3");
  const [targetRiserHeightM, setTargetRiserHeightM] = useState("0.17");
  const [treadDepthM, setTreadDepthM] = useState("0.28");
  const [stairWidthM, setStairWidthM] = useState("1.2");
  const [landingLengthM, setLandingLengthM] = useState("1.2");
  const [slabThicknessM, setSlabThicknessM] = useState("0.12");
  const [wastePercent, setWastePercent] = useState("8");

  const [output, setOutput] = useState<LandingStairOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCompute() {
    setError(null);

    const parsed = LandingStairInputSchema.safeParse({
      totalHeightM: toNumber(totalHeightM) ?? NaN,
      targetRiserHeightM: toNumber(targetRiserHeightM) ?? NaN,
      treadDepthM: toNumber(treadDepthM) ?? NaN,
      stairWidthM: toNumber(stairWidthM) ?? NaN,
      landingLengthM: toNumber(landingLengthM) ?? NaN,
      slabThicknessM: toNumber(slabThicknessM) ?? NaN,
      wastePercent: toNumber(wastePercent) ?? 0,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les champs numériques.");
      return;
    }

    try {
      setOutput(computeLandingStair(parsed.data));
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
          <CardDescription>Dimensions et objectifs de confort (MVP).</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Hauteur à franchir (m)" value={totalHeightM} onChange={(e) => setTotalHeightM(e.target.value)} />
            <Input
              label="Hauteur marche cible (m)"
              value={targetRiserHeightM}
              onChange={(e) => setTargetRiserHeightM(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Giron (m)" value={treadDepthM} onChange={(e) => setTreadDepthM(e.target.value)} />
            <Input label="Largeur escalier (m)" value={stairWidthM} onChange={(e) => setStairWidthM(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Longueur palier (m)" value={landingLengthM} onChange={(e) => setLandingLengthM(e.target.value)} />
            <Input label="Épaisseur dalle (m)" value={slabThicknessM} onChange={(e) => setSlabThicknessM(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Perte (%)" value={wastePercent} onChange={(e) => setWastePercent(e.target.value)} />
            <div />
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
          <CardDescription>Marches, béton et coffrage estimatifs.</CardDescription>
        </CardHeader>

        {output ? (
          <div className="grid gap-2 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
            <div>
              <span className="text-white/55">Nombre de marches:</span> {output.stepsCount}
            </div>
            <div>
              <span className="text-white/55">Hauteur marche:</span> {output.riserHeightM} m
            </div>
            <div>
              <span className="text-white/55">Longueur développée:</span> {output.runLengthM} m
            </div>
            <div>
              <span className="text-white/55">Volume béton:</span> {output.concreteVolumeM3} m³
            </div>
            <div>
              <span className="text-white/55">Surface coffrage:</span> {output.formworkSurfaceM2} m²
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
            Renseigne les paramètres puis clique sur “Calculer”.
          </div>
        )}
      </Card>

      <div className="text-xs text-white/50">Approximations pour un ordre de grandeur. Pour exécution, valider sur plans et normes.</div>
    </div>
  );
}
