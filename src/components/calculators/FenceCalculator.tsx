"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

import { computeFence, FenceInputSchema, type FenceOutput } from "@/lib/calculators/fence";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function FenceCalculator() {
  const [fenceLengthM, setFenceLengthM] = useState("30");
  const [fenceHeightM, setFenceHeightM] = useState("2");
  const [postSpacingM, setPostSpacingM] = useState("2.5");
  const [wastePercent, setWastePercent] = useState("8");
  const [costPerM2, setCostPerM2] = useState("");

  const [output, setOutput] = useState<FenceOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCompute() {
    setError(null);

    const parsed = FenceInputSchema.safeParse({
      fenceLengthM: toNumber(fenceLengthM) ?? NaN,
      fenceHeightM: toNumber(fenceHeightM) ?? NaN,
      postSpacingM: toNumber(postSpacingM) ?? NaN,
      wastePercent: toNumber(wastePercent) ?? 0,
      costPerM2: costPerM2.trim() ? (toNumber(costPerM2) ?? NaN) : undefined,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les champs numériques.");
      return;
    }

    try {
      setOutput(computeFence(parsed.data));
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
          <CardDescription>Linéaire, hauteur, poteaux et coût.</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Longueur clôture (m)" value={fenceLengthM} onChange={(e) => setFenceLengthM(e.target.value)} />
            <Input label="Hauteur (m)" value={fenceHeightM} onChange={(e) => setFenceHeightM(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Entraxe poteaux (m)" value={postSpacingM} onChange={(e) => setPostSpacingM(e.target.value)} />
            <Input label="Perte (%)" value={wastePercent} onChange={(e) => setWastePercent(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Coût (FCFA/m², optionnel)" value={costPerM2} onChange={(e) => setCostPerM2(e.target.value)} />
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
          <CardDescription>Poteaux, agglos, béton/acier (ordres de grandeur).</CardDescription>
        </CardHeader>

        {output ? (
          <div className="grid gap-2 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Nombre poteaux:</span> {output.postsCount}
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Surface mur:</span> {output.wallSurfaceM2} m²
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Agglos:</span> {output.blocksCount}
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Béton poteaux:</span> {output.postsConcreteVolumeM3} m³
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Béton longrine:</span> {output.footingConcreteVolumeM3} m³
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Béton total:</span> {output.totalConcreteVolumeM3} m³
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Acier estimé:</span> {output.steelEstimateKg} kg
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
        Modèle simplifié (MVP) : adapte sections, fondations et ferraillage selon sol et normes.
      </div>
    </div>
  );
}
