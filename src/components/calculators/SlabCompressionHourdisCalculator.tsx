"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

import {
  computeSlabCompressionHourdis,
  SlabCompressionHourdisInputSchema,
  type SlabCompressionHourdisOutput,
} from "@/lib/calculators/slabCompressionHourdis";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function SlabCompressionHourdisCalculator() {
  const [lengthM, setLengthM] = useState("10");
  const [widthM, setWidthM] = useState("8");
  const [compressionThicknessM, setCompressionThicknessM] = useState("0.05");
  const [joistSpacingM, setJoistSpacingM] = useState("0.6");
  const [hourdisLengthM, setHourdisLengthM] = useState("0.5");
  const [hourdisWidthM, setHourdisWidthM] = useState("0.2");
  const [wastePercent, setWastePercent] = useState("8");

  const [output, setOutput] = useState<SlabCompressionHourdisOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCompute() {
    setError(null);

    const parsed = SlabCompressionHourdisInputSchema.safeParse({
      lengthM: toNumber(lengthM) ?? NaN,
      widthM: toNumber(widthM) ?? NaN,
      compressionThicknessM: toNumber(compressionThicknessM) ?? NaN,
      joistSpacingM: toNumber(joistSpacingM) ?? NaN,
      hourdisLengthM: toNumber(hourdisLengthM) ?? NaN,
      hourdisWidthM: toNumber(hourdisWidthM) ?? NaN,
      wastePercent: toNumber(wastePercent) ?? 0,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les champs numériques.");
      return;
    }

    try {
      setOutput(computeSlabCompressionHourdis(parsed.data));
    } catch {
      setOutput(null);
      setError("Calcul impossible avec ces valeurs.");
    }
  }

  function handleReset() {
    setLengthM("10");
    setWidthM("8");
    setCompressionThicknessM("0.05");
    setJoistSpacingM("0.6");
    setHourdisLengthM("0.5");
    setHourdisWidthM("0.2");
    setWastePercent("8");
    setOutput(null);
    setError(null);
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>Dalle de compression sur hourdis (estimation).</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Longueur (m)" value={lengthM} onChange={(e) => setLengthM(e.target.value)} />
            <Input label="Largeur (m)" value={widthM} onChange={(e) => setWidthM(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Épaisseur compression (m)"
              value={compressionThicknessM}
              onChange={(e) => setCompressionThicknessM(e.target.value)}
            />
            <Input label="Entraxe poutrelles (m)" value={joistSpacingM} onChange={(e) => setJoistSpacingM(e.target.value)} />
            <Input label="Perte (%)" value={wastePercent} onChange={(e) => setWastePercent(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Longueur hourdis (m)" value={hourdisLengthM} onChange={(e) => setHourdisLengthM(e.target.value)} />
            <Input label="Largeur hourdis (m)" value={hourdisWidthM} onChange={(e) => setHourdisWidthM(e.target.value)} />
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
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Surface :</span> {output.areaM2} m²
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Béton compression :</span> {output.concreteVolumeWithWasteM3} m³ (avec perte)
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Poutrelles :</span> {output.joistsCount} (longueur totale {output.joistsTotalLengthM} m)
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Hourdis :</span> {output.hourdisCount} (estimation)
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Treillis (surface) :</span> {output.meshAreaM2} m²
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            Renseigne les paramètres puis clique sur “Calculer”.
          </div>
        )}
      </Card>

      <div className="text-xs text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">
        Ces résultats sont des estimations d’aide au chantier. Ils ne remplacent pas une étude structurelle, les plans d’exécution, les normes
        applicables ni la validation d’un ingénieur.
      </div>
    </div>
  );
}
