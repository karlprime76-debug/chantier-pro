"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

import {
  computePaintingAdvanced,
  PaintingAdvancedInputSchema,
  type PaintingAdvancedOutput,
} from "@/lib/calculators/paintingAdvanced";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function AdvancedPaintingCalculator() {
  const [wallsAreaM2, setWallsAreaM2] = useState("80");
  const [ceilingAreaM2, setCeilingAreaM2] = useState("0");
  const [coats, setCoats] = useState("2");
  const [coverageM2PerL, setCoverageM2PerL] = useState("10");
  const [wastePercent, setWastePercent] = useState("8");
  const [potSizeL, setPotSizeL] = useState("5");
  const [pricePerPot, setPricePerPot] = useState("");

  const [output, setOutput] = useState<PaintingAdvancedOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCompute() {
    setError(null);

    const parsed = PaintingAdvancedInputSchema.safeParse({
      wallsAreaM2: toNumber(wallsAreaM2) ?? 0,
      ceilingAreaM2: toNumber(ceilingAreaM2) ?? 0,
      coats: toNumber(coats) ?? NaN,
      coverageM2PerL: toNumber(coverageM2PerL) ?? NaN,
      wastePercent: toNumber(wastePercent) ?? 0,
      potSizeL: toNumber(potSizeL) ?? NaN,
      pricePerPot: pricePerPot.trim() ? (toNumber(pricePerPot) ?? NaN) : undefined,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les champs numériques.");
      return;
    }

    try {
      setOutput(computePaintingAdvanced(parsed.data));
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
          <CardDescription>Surfaces, couches, rendement, pots et coût.</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Surface murs (m²)" value={wallsAreaM2} onChange={(e) => setWallsAreaM2(e.target.value)} />
            <Input
              label="Surface plafond (m², optionnel)"
              value={ceilingAreaM2}
              onChange={(e) => setCeilingAreaM2(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nombre de couches" value={coats} onChange={(e) => setCoats(e.target.value)} />
            <Input label="Rendement (m²/L)" value={coverageM2PerL} onChange={(e) => setCoverageM2PerL(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Perte (%)" value={wastePercent} onChange={(e) => setWastePercent(e.target.value)} />
            <Input label="Taille pot (L)" value={potSizeL} onChange={(e) => setPotSizeL(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Prix par pot (optionnel)"
              value={pricePerPot}
              onChange={(e) => setPricePerPot(e.target.value)}
            />
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
          <CardDescription>Litres, pots et coût estimé.</CardDescription>
        </CardHeader>

        {output ? (
          <div className="grid gap-2 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Surface totale:</span> {output.totalAreaM2} m²
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Litres nécessaires:</span> {output.litersNeeded} L
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Nombre de pots:</span> {output.potsCount}
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Coût estimé:</span> {output.estimatedCost === null ? "—" : `${output.estimatedCost} FCFA`}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            Renseigne les paramètres puis clique sur “Calculer”.
          </div>
        )}
      </Card>

      <div className="text-xs text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">
        Rappel: le rendement dépend fortement du support, de la sous-couche et de la qualité d’application.
      </div>
    </div>
  );
}
