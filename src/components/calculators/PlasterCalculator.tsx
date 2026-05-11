"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

import { computePlaster, PlasterInputSchema, type PlasterOutput } from "@/lib/calculators/plaster";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function PlasterCalculator() {
  const [areaM2, setAreaM2] = useState("50");
  const [thicknessMm, setThicknessMm] = useState("15");
  const [cementDosageKgPerM3, setCementDosageKgPerM3] = useState("250");
  const [wastePercent, setWastePercent] = useState("8");
  const [pricePerM2, setPricePerM2] = useState("");

  const [output, setOutput] = useState<PlasterOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCompute() {
    setError(null);

    const parsed = PlasterInputSchema.safeParse({
      areaM2: toNumber(areaM2) ?? NaN,
      thicknessMm: toNumber(thicknessMm) ?? NaN,
      cementDosageKgPerM3: toNumber(cementDosageKgPerM3) ?? NaN,
      wastePercent: toNumber(wastePercent) ?? 0,
      pricePerM2: pricePerM2.trim() ? (toNumber(pricePerM2) ?? NaN) : undefined,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les champs numériques.");
      return;
    }

    try {
      setOutput(computePlaster(parsed.data));
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
          <CardDescription>Surface, épaisseur, dosage et perte.</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Surface à enduire (m²)" value={areaM2} onChange={(e) => setAreaM2(e.target.value)} />
            <Input label="Épaisseur enduit (mm)" value={thicknessMm} onChange={(e) => setThicknessMm(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Dosage ciment (kg/m³)"
              value={cementDosageKgPerM3}
              onChange={(e) => setCementDosageKgPerM3(e.target.value)}
            />
            <Input label="Perte (%)" value={wastePercent} onChange={(e) => setWastePercent(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Coût (FCFA/m², optionnel)" value={pricePerM2} onChange={(e) => setPricePerM2(e.target.value)} />
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
          <CardDescription>Mortier, ciment et sable estimatifs.</CardDescription>
        </CardHeader>

        {output ? (
          <div className="grid gap-2 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
            <div>
              <span className="text-white/55">Volume mortier:</span> {output.mortarVolumeM3} m³
            </div>
            <div>
              <span className="text-white/55">Volume + perte:</span> {output.mortarVolumeWithWasteM3} m³
            </div>
            <div>
              <span className="text-white/55">Ciment:</span> {output.cementEstimateKg} kg ({output.cementBagsCount} sacs)
            </div>
            <div>
              <span className="text-white/55">Sable:</span> {output.sandEstimateM3} m³
            </div>
            <div>
              <span className="text-white/55">Coût estimé:</span> {output.estimatedCost === null ? "—" : `${output.estimatedCost} FCFA`}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
            Renseigne les paramètres puis clique sur “Calculer”.
          </div>
        )}
      </Card>

      <div className="text-xs text-white/50">Dosage et rendements indicatifs : adapte selon le type d’enduit et le support.</div>
    </div>
  );
}
