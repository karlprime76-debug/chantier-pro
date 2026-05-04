"use client";

import { useState } from "react";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

import {
  computeStraightStair,
  StairStraightInputSchema,
  type StairStraightOutput,
} from "@/lib/calculators/stairStraight";

type StepsMode = "auto" | "manual";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function StraightStairCalculator() {
  const [stepsMode, setStepsMode] = useState<StepsMode>("auto");

  const [totalHeightCm, setTotalHeightCm] = useState("280");
  const [availableLengthCm, setAvailableLengthCm] = useState("350");
  const [stairWidthCm, setStairWidthCm] = useState("110");
  const [stepsCount, setStepsCount] = useState("16");
  const [slabThicknessCm, setSlabThicknessCm] = useState("12");
  const [concreteDosageKgM3, setConcreteDosageKgM3] = useState("350");
  const [wasteMarginPercent, setWasteMarginPercent] = useState("8");
  const [pricePerM3, setPricePerM3] = useState("");

  const [output, setOutput] = useState<StairStraightOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const comfortLabel = output
    ? {
        confortable: "Confortable",
        acceptable: "Acceptable",
        trop_raid: "Trop raide",
        giron_insuffisant: "Giron insuffisant",
        hauteur_excessive: "Hauteur de marche excessive",
      }[output.comfortStatus]
    : null;

  function handleCompute() {
    setError(null);

    const parsed = StairStraightInputSchema.safeParse({
      totalHeightCm: toNumber(totalHeightCm) ?? NaN,
      availableLengthCm: toNumber(availableLengthCm) ?? NaN,
      stairWidthCm: toNumber(stairWidthCm) ?? NaN,
      slabThicknessCm: toNumber(slabThicknessCm) ?? NaN,
      concreteDosageKgM3: toNumber(concreteDosageKgM3) ?? NaN,
      wasteMarginPercent: toNumber(wasteMarginPercent) ?? NaN,
      stepsMode,
      stepsCount: stepsMode === "manual" ? (toNumber(stepsCount) ?? undefined) : undefined,
      pricePerM3: toNumber(pricePerM3) ?? undefined,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les champs numériques.");
      return;
    }

    try {
      const nextOutput = computeStraightStair(parsed.data);
      setOutput(nextOutput);
    } catch {
      setOutput(null);
      setError("Calcul impossible avec ces valeurs.");
    }
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Hauteur totale à franchir (cm)"
          name="totalHeightCm"
          value={totalHeightCm}
          onChange={(e) => setTotalHeightCm(e.target.value)}
        />
        <Input
          label="Longueur disponible (cm)"
          name="availableLengthCm"
          value={availableLengthCm}
          onChange={(e) => setAvailableLengthCm(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Largeur de l’escalier (cm)"
          name="stairWidthCm"
          value={stairWidthCm}
          onChange={(e) => setStairWidthCm(e.target.value)}
        />
        <Input
          label="Épaisseur de paillasse (cm)"
          name="slabThicknessCm"
          value={slabThicknessCm}
          onChange={(e) => setSlabThicknessCm(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <div className="mb-1 text-sm font-semibold text-white/85">Nombre de marches</div>
          <select
            value={stepsMode}
            onChange={(e) => setStepsMode(e.target.value as StepsMode)}
            className="h-11 w-full rounded-xl bg-white/5 px-3 text-sm text-white ring-1 ring-white/10 outline-none transition focus:ring-2 focus:ring-[var(--cp-accent)]"
          >
            <option value="auto">Automatique</option>
            <option value="manual">Manuel</option>
          </select>
        </label>

        <Input
          label="Nombre de marches (manuel)"
          name="stepsCount"
          value={stepsCount}
          onChange={(e) => setStepsCount(e.target.value)}
          disabled={stepsMode !== "manual"}
        />

        <div />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Input
          label="Dosage béton (kg/m³)"
          name="concreteDosageKgM3"
          value={concreteDosageKgM3}
          onChange={(e) => setConcreteDosageKgM3(e.target.value)}
        />
        <Input
          label="Marge de perte (%)"
          name="wasteMarginPercent"
          value={wasteMarginPercent}
          onChange={(e) => setWasteMarginPercent(e.target.value)}
        />
        <Input
          label="Prix estimatif du m³ (optionnel)"
          name="pricePerM3"
          value={pricePerM3}
          onChange={(e) => setPricePerM3(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button type="button" variant="secondary" onClick={handleCompute}>
          Calculer
        </Button>
      </div>

      {error ? <div className="text-sm text-[var(--cp-accent)]">{error}</div> : null}

      {output ? (
        <div className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="text-sm font-bold text-white">Résultats</div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="text-sm text-white/70">
              Nombre de marches: <span className="font-semibold text-white">{output.stepsCount}</span>
            </div>
            <div className="text-sm text-white/70">
              Hauteur de marche (H): <span className="font-semibold text-white">{output.riserHeightCm} cm</span>
            </div>
            <div className="text-sm text-white/70">
              Giron (G): <span className="font-semibold text-white">{output.goingCm} cm</span>
            </div>
            <div className="text-sm text-white/70">
              Confort (2H + G): <span className="font-semibold text-white">{output.comfortValueCm} cm</span>
            </div>
          </div>

          <div className="text-sm text-white/70">
            Conformité: <span className="font-semibold text-white">{comfortLabel}</span>
          </div>

          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div className="text-sm text-white/70">
              Longueur de paillasse: <span className="font-semibold text-white">{output.slabLengthM} m</span>
            </div>
            <div className="text-sm text-white/70">
              Volume béton: <span className="font-semibold text-white">{output.concreteVolumeM3} m³</span>
            </div>
            <div className="text-sm text-white/70">
              Volume béton + perte: <span className="font-semibold text-white">{output.concreteVolumeWithWasteM3} m³</span>
            </div>
            <div className="text-sm text-white/70">
              Surface coffrage: <span className="font-semibold text-white">{output.formworkAreaM2} m²</span>
            </div>
            <div className="text-sm text-white/70">
              Ciment estimatif: <span className="font-semibold text-white">{output.cementEstimateKg} kg</span>
            </div>
            <div className="text-sm text-white/70">
              Sable estimatif: <span className="font-semibold text-white">{output.sandEstimateM3} m³</span>
            </div>
            <div className="text-sm text-white/70">
              Gravier estimatif: <span className="font-semibold text-white">{output.gravelEstimateM3} m³</span>
            </div>
            {output.estimatedCost !== null ? (
              <div className="text-sm text-white/70">
                Coût estimatif: <span className="font-semibold text-white">{output.estimatedCost}</span>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
