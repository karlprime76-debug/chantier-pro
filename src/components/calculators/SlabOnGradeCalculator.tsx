"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

import {
  computeSlabOnGrade,
  SlabOnGradeInputSchema,
  type SlabOnGradeOutput,
} from "@/lib/calculators/slabOnGrade";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function SlabOnGradeCalculator() {
  const [lengthM, setLengthM] = useState("10");
  const [widthM, setWidthM] = useState("8");
  const [concreteThicknessM, setConcreteThicknessM] = useState("0.12");
  const [subbaseThicknessM, setSubbaseThicknessM] = useState("0.15");
  const [sandThicknessM, setSandThicknessM] = useState("0.05");
  const [hasPolyane, setHasPolyane] = useState(true);
  const [hasWeldedMesh, setHasWeldedMesh] = useState(true);
  const [wastePercent, setWastePercent] = useState("8");

  const [output, setOutput] = useState<SlabOnGradeOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCompute() {
    setError(null);

    const parsed = SlabOnGradeInputSchema.safeParse({
      lengthM: toNumber(lengthM) ?? NaN,
      widthM: toNumber(widthM) ?? NaN,
      concreteThicknessM: toNumber(concreteThicknessM) ?? NaN,
      subbaseThicknessM: toNumber(subbaseThicknessM) ?? NaN,
      sandThicknessM: toNumber(sandThicknessM) ?? NaN,
      hasPolyane,
      hasWeldedMesh,
      wastePercent: toNumber(wastePercent) ?? 0,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les champs numériques.");
      return;
    }

    try {
      setOutput(computeSlabOnGrade(parsed.data));
    } catch {
      setOutput(null);
      setError("Calcul impossible avec ces valeurs.");
    }
  }

  function handleReset() {
    setLengthM("10");
    setWidthM("8");
    setConcreteThicknessM("0.12");
    setSubbaseThicknessM("0.15");
    setSandThicknessM("0.05");
    setHasPolyane(true);
    setHasWeldedMesh(true);
    setWastePercent("8");
    setOutput(null);
    setError(null);
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>Dalle sur terre-plein : béton + couches + options (estimation).</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Longueur (m)" value={lengthM} onChange={(e) => setLengthM(e.target.value)} />
            <Input label="Largeur (m)" value={widthM} onChange={(e) => setWidthM(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Épaisseur béton (m)" value={concreteThicknessM} onChange={(e) => setConcreteThicknessM(e.target.value)} />
            <Input
              label="Épaisseur couche de forme (m)"
              value={subbaseThicknessM}
              onChange={(e) => setSubbaseThicknessM(e.target.value)}
            />
            <Input label="Épaisseur sable (m)" value={sandThicknessM} onChange={(e) => setSandThicknessM(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <div className="mb-1 text-sm font-semibold text-[var(--app-text)]">Polyane</div>
              <select
                className="h-11 w-full rounded-xl bg-[var(--app-input-bg)] px-3 text-sm text-[var(--app-text)] ring-1 ring-[var(--app-card-border)] outline-none transition focus:ring-2 focus:ring-[var(--cp-accent)]"
                value={hasPolyane ? "yes" : "no"}
                onChange={(e) => setHasPolyane(e.target.value === "yes")}
              >
                <option value="yes">Oui</option>
                <option value="no">Non</option>
              </select>
            </label>

            <label className="block">
              <div className="mb-1 text-sm font-semibold text-[var(--app-text)]">Treillis soudé</div>
              <select
                className="h-11 w-full rounded-xl bg-[var(--app-input-bg)] px-3 text-sm text-[var(--app-text)] ring-1 ring-[var(--app-card-border)] outline-none transition focus:ring-2 focus:ring-[var(--cp-accent)]"
                value={hasWeldedMesh ? "yes" : "no"}
                onChange={(e) => setHasWeldedMesh(e.target.value === "yes")}
              >
                <option value="yes">Oui</option>
                <option value="no">Non</option>
              </select>
            </label>

            <Input label="Perte béton (%)" value={wastePercent} onChange={(e) => setWastePercent(e.target.value)} />
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
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Béton :</span> {output.concreteVolumeWithWasteM3} m³ (avec perte)
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Couche de forme :</span> {output.subbaseVolumeM3} m³
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Sable :</span> {output.sandVolumeM3} m³
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Polyane :</span> {output.polyaneAreaM2 !== null ? `${output.polyaneAreaM2} m²` : "Non"}
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Treillis soudé :</span> {output.weldedMeshAreaM2 !== null ? `${output.weldedMeshAreaM2} m²` : "Non"}
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
