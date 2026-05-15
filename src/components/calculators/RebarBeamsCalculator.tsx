"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

import { computeRebarBeams, RebarBeamsInputSchema, type RebarBeamsOutput } from "@/lib/calculators/rebarBeams";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

const DIAMETERS_MM = [6, 8, 10, 12, 14, 16];

export function RebarBeamsCalculator() {
  const [beamsCount, setBeamsCount] = useState("4");
  const [beamLengthM, setBeamLengthM] = useState("4");

  const [topBarsCount, setTopBarsCount] = useState("2");
  const [bottomBarsCount, setBottomBarsCount] = useState("2");
  const [diameterBarsMm, setDiameterBarsMm] = useState("12");
  const [overlapM, setOverlapM] = useState("0.4");

  const [stirrupSpacingCm, setStirrupSpacingCm] = useState("15");
  const [diameterStirrupsMm, setDiameterStirrupsMm] = useState("6");

  const [beamWidthCm, setBeamWidthCm] = useState("20");
  const [beamHeightCm, setBeamHeightCm] = useState("40");
  const [coverCm, setCoverCm] = useState("3");
  const [stirrupHookLengthCm, setStirrupHookLengthCm] = useState("10");

  const [wastePercent, setWastePercent] = useState("8");

  const [output, setOutput] = useState<RebarBeamsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCompute() {
    setError(null);

    const parsed = RebarBeamsInputSchema.safeParse({
      beamsCount: toNumber(beamsCount) ?? NaN,
      beamLengthM: toNumber(beamLengthM) ?? NaN,
      topBarsCount: toNumber(topBarsCount) ?? NaN,
      bottomBarsCount: toNumber(bottomBarsCount) ?? NaN,
      overlapM: toNumber(overlapM) ?? 0,
      stirrupSpacingCm: toNumber(stirrupSpacingCm) ?? NaN,
      beamWidthCm: toNumber(beamWidthCm) ?? NaN,
      beamHeightCm: toNumber(beamHeightCm) ?? NaN,
      coverCm: toNumber(coverCm) ?? 0,
      stirrupHookLengthCm: toNumber(stirrupHookLengthCm) ?? 0,
      wastePercent: toNumber(wastePercent) ?? 0,
      diameterBarsMm: toNumber(diameterBarsMm) ?? NaN,
      diameterStirrupsMm: toNumber(diameterStirrupsMm) ?? NaN,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les champs numériques.");
      return;
    }

    try {
      setOutput(computeRebarBeams(parsed.data));
    } catch {
      setOutput(null);
      setError("Calcul impossible avec ces valeurs.");
    }
  }

  function handleReset() {
    setBeamsCount("4");
    setBeamLengthM("4");
    setTopBarsCount("2");
    setBottomBarsCount("2");
    setDiameterBarsMm("12");
    setOverlapM("0.4");
    setStirrupSpacingCm("15");
    setDiameterStirrupsMm("6");
    setBeamWidthCm("20");
    setBeamHeightCm("40");
    setCoverCm("3");
    setStirrupHookLengthCm("10");
    setWastePercent("8");
    setOutput(null);
    setError(null);
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>Quantités de base pour poutres (estimation).</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nombre de poutres" value={beamsCount} onChange={(e) => setBeamsCount(e.target.value)} />
            <Input label="Longueur poutre (m)" value={beamLengthM} onChange={(e) => setBeamLengthM(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Barres supérieures / poutre" value={topBarsCount} onChange={(e) => setTopBarsCount(e.target.value)} />
            <Input
              label="Barres inférieures / poutre"
              value={bottomBarsCount}
              onChange={(e) => setBottomBarsCount(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <div className="mb-1 text-sm font-semibold text-[var(--app-text)]">Diamètre barres (mm)</div>
              <select
                className="h-11 w-full rounded-xl bg-[var(--app-input-bg)] px-3 text-sm text-[var(--app-text)] ring-1 ring-[var(--app-card-border)] outline-none transition focus:ring-2 focus:ring-[var(--cp-accent)]"
                value={diameterBarsMm}
                onChange={(e) => setDiameterBarsMm(e.target.value)}
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
            <Input label="Espacement étriers (cm)" value={stirrupSpacingCm} onChange={(e) => setStirrupSpacingCm(e.target.value)} />
            <label className="block">
              <div className="mb-1 text-sm font-semibold text-[var(--app-text)]">Diamètre étriers (mm)</div>
              <select
                className="h-11 w-full rounded-xl bg-[var(--app-input-bg)] px-3 text-sm text-[var(--app-text)] ring-1 ring-[var(--app-card-border)] outline-none transition focus:ring-2 focus:ring-[var(--cp-accent)]"
                value={diameterStirrupsMm}
                onChange={(e) => setDiameterStirrupsMm(e.target.value)}
              >
                {DIAMETERS_MM.map((d) => (
                  <option key={d} value={String(d)}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Section poutre (largeur, cm)" value={beamWidthCm} onChange={(e) => setBeamWidthCm(e.target.value)} />
            <Input label="Section poutre (hauteur, cm)" value={beamHeightCm} onChange={(e) => setBeamHeightCm(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Enrobage (cm)" value={coverCm} onChange={(e) => setCoverCm(e.target.value)} />
            <Input
              label="Longueur crochets étrier (cm)"
              value={stirrupHookLengthCm}
              onChange={(e) => setStirrupHookLengthCm(e.target.value)}
            />
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
          <CardDescription>Longueurs et poids estimatifs.</CardDescription>
        </CardHeader>

        {output ? (
          <div className="grid gap-2 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Longueur longitudinal:</span> {output.longitudinalTotalLengthM} m
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Nombre d’étriers:</span> {output.stirrupsCount}
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Longueur étriers:</span> {output.stirrupsTotalLengthM} m
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Longueur totale (avec perte):</span> {output.totalLengthM} m
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Poids total (avec perte):</span> {output.totalWeightKg} kg
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
