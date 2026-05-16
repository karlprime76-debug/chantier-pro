"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

import {
  computeSlabReinforced,
  SlabReinforcedInputSchema,
  type SlabReinforcedOutput,
} from "@/lib/calculators/slabReinforced";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

const DIAMETERS_MM = [6, 8, 10, 12, 14, 16];

export function SlabReinforcedCalculator() {
  const [lengthM, setLengthM] = useState("10");
  const [widthM, setWidthM] = useState("8");
  const [thicknessM, setThicknessM] = useState("0.12");
  const [wastePercent, setWastePercent] = useState("8");

  const [diameterXmm, setDiameterXmm] = useState("10");
  const [spacingXcm, setSpacingXcm] = useState("20");
  const [diameterYmm, setDiameterYmm] = useState("10");
  const [spacingYcm, setSpacingYcm] = useState("20");
  const [overlapM, setOverlapM] = useState("0.4");

  const [pricePerM3Concrete, setPricePerM3Concrete] = useState("");
  const [pricePerKgSteel, setPricePerKgSteel] = useState("");

  const [output, setOutput] = useState<SlabReinforcedOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCompute() {
    setError(null);

    const parsed = SlabReinforcedInputSchema.safeParse({
      lengthM: toNumber(lengthM) ?? NaN,
      widthM: toNumber(widthM) ?? NaN,
      thicknessM: toNumber(thicknessM) ?? NaN,
      wastePercent: toNumber(wastePercent) ?? 0,

      diameterXmm: toNumber(diameterXmm) ?? NaN,
      spacingXcm: toNumber(spacingXcm) ?? NaN,
      diameterYmm: toNumber(diameterYmm) ?? NaN,
      spacingYcm: toNumber(spacingYcm) ?? NaN,

      overlapM: toNumber(overlapM) ?? 0,

      pricePerM3Concrete: pricePerM3Concrete.trim() ? (toNumber(pricePerM3Concrete) ?? NaN) : undefined,
      pricePerKgSteel: pricePerKgSteel.trim() ? (toNumber(pricePerKgSteel) ?? NaN) : undefined,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les champs numériques.");
      return;
    }

    try {
      setOutput(computeSlabReinforced(parsed.data));
    } catch {
      setOutput(null);
      setError("Calcul impossible avec ces valeurs.");
    }
  }

  function handleReset() {
    setLengthM("10");
    setWidthM("8");
    setThicknessM("0.12");
    setWastePercent("8");

    setDiameterXmm("10");
    setSpacingXcm("20");
    setDiameterYmm("10");
    setSpacingYcm("20");
    setOverlapM("0.4");

    setPricePerM3Concrete("");
    setPricePerKgSteel("");

    setOutput(null);
    setError(null);
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>Dalle pleine en béton armé : estimation béton + ferraillage + coûts.</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Longueur (m)" value={lengthM} onChange={(e) => setLengthM(e.target.value)} />
            <Input label="Largeur (m)" value={widthM} onChange={(e) => setWidthM(e.target.value)} />
            <Input label="Épaisseur (m)" value={thicknessM} onChange={(e) => setThicknessM(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Perte béton (%)" value={wastePercent} onChange={(e) => setWastePercent(e.target.value)} />
            <Input label="Recouvrement (m)" value={overlapM} onChange={(e) => setOverlapM(e.target.value)} />
            <div />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Armatures sens X</CardTitle>
                <CardDescription>Diamètre + espacement.</CardDescription>
              </CardHeader>
              <div className="grid gap-4 p-6 pt-0">
                <label className="block">
                  <div className="mb-1 text-sm font-semibold text-[var(--app-text)]">Diamètre (mm)</div>
                  <select
                    className="h-11 w-full rounded-xl bg-[var(--app-input-bg)] px-3 text-sm text-[var(--app-text)] ring-1 ring-[var(--app-card-border)] outline-none transition focus:ring-2 focus:ring-[var(--cp-accent)]"
                    value={diameterXmm}
                    onChange={(e) => setDiameterXmm(e.target.value)}
                  >
                    {DIAMETERS_MM.map((d) => (
                      <option key={d} value={String(d)}>
                        {d}
                      </option>
                    ))}
                  </select>
                </label>
                <Input label="Espacement (cm)" value={spacingXcm} onChange={(e) => setSpacingXcm(e.target.value)} />
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Armatures sens Y</CardTitle>
                <CardDescription>Diamètre + espacement.</CardDescription>
              </CardHeader>
              <div className="grid gap-4 p-6 pt-0">
                <label className="block">
                  <div className="mb-1 text-sm font-semibold text-[var(--app-text)]">Diamètre (mm)</div>
                  <select
                    className="h-11 w-full rounded-xl bg-[var(--app-input-bg)] px-3 text-sm text-[var(--app-text)] ring-1 ring-[var(--app-card-border)] outline-none transition focus:ring-2 focus:ring-[var(--cp-accent)]"
                    value={diameterYmm}
                    onChange={(e) => setDiameterYmm(e.target.value)}
                  >
                    {DIAMETERS_MM.map((d) => (
                      <option key={d} value={String(d)}>
                        {d}
                      </option>
                    ))}
                  </select>
                </label>
                <Input label="Espacement (cm)" value={spacingYcm} onChange={(e) => setSpacingYcm(e.target.value)} />
              </div>
            </Card>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Prix béton (FCFA / m³)"
              hint="Optionnel. Sert au coût estimatif."
              value={pricePerM3Concrete}
              onChange={(e) => setPricePerM3Concrete(e.target.value)}
            />
            <Input
              label="Prix acier (FCFA / kg)"
              hint="Optionnel. Sert au coût estimatif."
              value={pricePerKgSteel}
              onChange={(e) => setPricePerKgSteel(e.target.value)}
            />
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
            <div className="mt-2 text-sm font-bold text-[var(--app-text)]">Ferraillage (estimation)</div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Barres X :</span> {output.barsXCount} × {output.barXLengthM} m
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Barres Y :</span> {output.barsYCount} × {output.barYLengthM} m
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Longueur acier totale :</span> {output.totalSteelLengthM} m
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Poids acier total :</span> {output.totalSteelWeightKg} kg
            </div>
            <div className="mt-2 text-sm font-bold text-[var(--app-text)]">Coûts (si prix renseignés)</div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Coût béton :</span> {output.concreteCost !== null ? `${output.concreteCost} FCFA` : "—"}
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Coût acier :</span> {output.steelCost !== null ? `${output.steelCost} FCFA` : "—"}
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Total :</span> {output.totalCost !== null ? `${output.totalCost} FCFA` : "—"}
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
