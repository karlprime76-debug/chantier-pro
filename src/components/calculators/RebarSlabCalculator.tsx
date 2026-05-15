"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

import { computeRebarSlab, RebarSlabInputSchema, type RebarSlabOutput } from "@/lib/calculators/rebarSlab";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

const DIAMETERS_MM = [6, 8, 10, 12, 14, 16];

export function RebarSlabCalculator() {
  const [slabLengthM, setSlabLengthM] = useState("8");
  const [slabWidthM, setSlabWidthM] = useState("6");

  const [spacingXcm, setSpacingXcm] = useState("20");
  const [spacingYcm, setSpacingYcm] = useState("20");
  const [diameterMm, setDiameterMm] = useState("10");

  const [overlapM, setOverlapM] = useState("0.4");
  const [wastePercent, setWastePercent] = useState("8");

  const [output, setOutput] = useState<RebarSlabOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCompute() {
    setError(null);

    const parsed = RebarSlabInputSchema.safeParse({
      slabLengthM: toNumber(slabLengthM) ?? NaN,
      slabWidthM: toNumber(slabWidthM) ?? NaN,
      spacingXcm: toNumber(spacingXcm) ?? NaN,
      spacingYcm: toNumber(spacingYcm) ?? NaN,
      overlapM: toNumber(overlapM) ?? 0,
      wastePercent: toNumber(wastePercent) ?? 0,
      diameterMm: toNumber(diameterMm) ?? NaN,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les champs numériques.");
      return;
    }

    try {
      setOutput(computeRebarSlab(parsed.data));
    } catch {
      setOutput(null);
      setError("Calcul impossible avec ces valeurs.");
    }
  }

  function handleReset() {
    setSlabLengthM("8");
    setSlabWidthM("6");
    setSpacingXcm("20");
    setSpacingYcm("20");
    setDiameterMm("10");
    setOverlapM("0.4");
    setWastePercent("8");
    setOutput(null);
    setError(null);
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>Estimation ferraillage dalle (sens X/Y).</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Longueur dalle (m)" value={slabLengthM} onChange={(e) => setSlabLengthM(e.target.value)} />
            <Input label="Largeur dalle (m)" value={slabWidthM} onChange={(e) => setSlabWidthM(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Espacement barres sens X (cm)" value={spacingXcm} onChange={(e) => setSpacingXcm(e.target.value)} />
            <Input label="Espacement barres sens Y (cm)" value={spacingYcm} onChange={(e) => setSpacingYcm(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <div className="mb-1 text-sm font-semibold text-[var(--app-text)]">Diamètre barres (mm)</div>
              <select
                className="h-11 w-full rounded-xl bg-[var(--app-input-bg)] px-3 text-sm text-[var(--app-text)] ring-1 ring-[var(--app-card-border)] outline-none transition focus:ring-2 focus:ring-[var(--cp-accent)]"
                value={diameterMm}
                onChange={(e) => setDiameterMm(e.target.value)}
              >
                {DIAMETERS_MM.map((d) => (
                  <option key={d} value={String(d)}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
            <Input label="Recouvrement (m)" value={overlapM} onChange={(e) => setOverlapM(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Perte (%)" value={wastePercent} onChange={(e) => setWastePercent(e.target.value)} />
            <div />
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
          <CardDescription>Quantités estimatives.</CardDescription>
        </CardHeader>

        {output ? (
          <div className="grid gap-2 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Barres sens X:</span> {output.barsXCount}
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Barres sens Y:</span> {output.barsYCount}
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Longueur totale (avec perte):</span> {output.totalLengthM} m
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Poids total:</span> {output.totalWeightKg} kg
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            Renseigne les paramètres puis clique sur “Calculer”.
          </div>
        )}
      </Card>

      <div className="text-xs text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">
        Les résultats sont des estimations d’aide au chantier. Ils doivent être vérifiés selon les plans, les normes applicables et les
        conditions réelles du projet. Ce calcul ne remplace pas une étude technique, ni la validation d’un ingénieur.
      </div>
    </div>
  );
}
