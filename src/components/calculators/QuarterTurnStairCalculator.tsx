"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

import {
  computeQuarterTurnStair,
  QuarterTurnStairInputSchema,
  type QuarterTurnStairOutput,
} from "@/lib/calculators/quarterTurnStair";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function QuarterTurnStairCalculator() {
  const [totalHeightM, setTotalHeightM] = useState("3");
  const [stairWidthM, setStairWidthM] = useState("1.2");
  const [targetRiserHeightM, setTargetRiserHeightM] = useState("0.17");
  const [treadDepthM, setTreadDepthM] = useState("0.28");
  const [balancedStepsCount, setBalancedStepsCount] = useState("3");
  const [slabThicknessM, setSlabThicknessM] = useState("0.12");
  const [wastePercent, setWastePercent] = useState("8");

  const [output, setOutput] = useState<QuarterTurnStairOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCompute() {
    setError(null);

    const parsed = QuarterTurnStairInputSchema.safeParse({
      totalHeightM: toNumber(totalHeightM) ?? NaN,
      stairWidthM: toNumber(stairWidthM) ?? NaN,
      targetRiserHeightM: toNumber(targetRiserHeightM) ?? NaN,
      treadDepthM: toNumber(treadDepthM) ?? NaN,
      balancedStepsCount: toNumber(balancedStepsCount) ?? 0,
      slabThicknessM: toNumber(slabThicknessM) ?? NaN,
      wastePercent: toNumber(wastePercent) ?? 0,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les champs numériques.");
      return;
    }

    try {
      setOutput(computeQuarterTurnStair(parsed.data));
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
          <CardDescription>Pré-dimensionnement (MVP) : valeurs indicatives.</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Hauteur à franchir (m)" value={totalHeightM} onChange={(e) => setTotalHeightM(e.target.value)} />
            <Input label="Largeur escalier (m)" value={stairWidthM} onChange={(e) => setStairWidthM(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Hauteur marche cible (m)"
              value={targetRiserHeightM}
              onChange={(e) => setTargetRiserHeightM(e.target.value)}
            />
            <Input label="Giron (m)" value={treadDepthM} onChange={(e) => setTreadDepthM(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Marches balancées (nb)"
              value={balancedStepsCount}
              onChange={(e) => setBalancedStepsCount(e.target.value)}
            />
            <Input label="Épaisseur (m)" value={slabThicknessM} onChange={(e) => setSlabThicknessM(e.target.value)} />
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
          <CardDescription>Nombre de marches + emprise + quantités estimatives.</CardDescription>
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
              <span className="text-white/55">Marches balancées:</span> {output.balancedStepsCount}
            </div>
            <div>
              <span className="text-white/55">Emprise approx.:</span> {output.footprintLengthM} m × {output.footprintWidthM} m
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

      <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-xs text-white/60">
        <div className="font-semibold text-white/80">Avertissement</div>
        <div>
          Calcul indicatif (MVP). Pour exécution, valider l’implantation, la structure et les détails (balancement, reculement,
          ferraillage) avec un ingénieur / BET.
        </div>
      </div>
    </div>
  );
}
