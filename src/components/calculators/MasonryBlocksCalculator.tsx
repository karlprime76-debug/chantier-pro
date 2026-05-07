"use client";

import { useState } from "react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

import {
  computeMasonryBlocks,
  MasonryBlocksInputSchema,
  type MasonryBlocksOutput,
} from "@/lib/calculators/masonryBlocks";

type UnitPreset = "agglos_20" | "brick" | "custom";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function MasonryBlocksCalculator() {
  const [preset, setPreset] = useState<UnitPreset>("agglos_20");

  const [wallLengthM, setWallLengthM] = useState("6");
  const [wallHeightM, setWallHeightM] = useState("2.8");

  const [blockLengthCm, setBlockLengthCm] = useState("40");
  const [blockHeightCm, setBlockHeightCm] = useState("20");

  const [wastePercent, setWastePercent] = useState("8");
  const [mortarThicknessCm, setMortarThicknessCm] = useState("2");

  const [output, setOutput] = useState<MasonryBlocksOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCompute() {
    setError(null);

    const parsed = MasonryBlocksInputSchema.safeParse({
      wallLengthM: toNumber(wallLengthM) ?? NaN,
      wallHeightM: toNumber(wallHeightM) ?? NaN,
      blockLengthCm: toNumber(blockLengthCm) ?? NaN,
      blockHeightCm: toNumber(blockHeightCm) ?? NaN,
      wastePercent: toNumber(wastePercent) ?? NaN,
      mortarThicknessCm: toNumber(mortarThicknessCm) ?? undefined,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les champs numériques.");
      return;
    }

    try {
      setOutput(computeMasonryBlocks(parsed.data));
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
          <CardDescription>Surface du mur, blocs/briques et marge de perte.</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <label className="block">
            <div className="mb-1 text-sm font-semibold text-white/85">Type de bloc</div>
            <select
              value={preset}
              onChange={(e) => {
                const next = e.target.value as UnitPreset;
                setPreset(next);
                if (next === "agglos_20") {
                  setBlockLengthCm("40");
                  setBlockHeightCm("20");
                }
                if (next === "brick") {
                  setBlockLengthCm("22");
                  setBlockHeightCm("6");
                }
              }}
              className="h-11 w-full rounded-xl bg-white/5 px-3 text-sm text-white ring-1 ring-white/10 outline-none transition focus:ring-2 focus:ring-[var(--cp-accent)]"
            >
              <option value="agglos_20">Agglo 40×20</option>
              <option value="brick">Brique 22×6</option>
              <option value="custom">Personnalisé</option>
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Longueur du mur (m)" value={wallLengthM} onChange={(e) => setWallLengthM(e.target.value)} />
            <Input label="Hauteur du mur (m)" value={wallHeightM} onChange={(e) => setWallHeightM(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Longueur bloc (cm)"
              value={blockLengthCm}
              onChange={(e) => setBlockLengthCm(e.target.value)}
              disabled={preset !== "custom"}
            />
            <Input
              label="Hauteur bloc (cm)"
              value={blockHeightCm}
              onChange={(e) => setBlockHeightCm(e.target.value)}
              disabled={preset !== "custom"}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Marge de perte (%)" value={wastePercent} onChange={(e) => setWastePercent(e.target.value)} />
            <Input
              label="Épaisseur mortier (cm, optionnel)"
              value={mortarThicknessCm}
              onChange={(e) => setMortarThicknessCm(e.target.value)}
            />
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
          <CardDescription>Quantités estimatives.</CardDescription>
        </CardHeader>

        {output ? (
          <div className="grid gap-2 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
            <div>
              <span className="text-white/55">Surface mur:</span> {output.wallAreaM2} m²
            </div>
            <div>
              <span className="text-white/55">Blocs:</span> {output.blocksCount}
            </div>
            <div>
              <span className="text-white/55">Blocs + perte:</span> {output.blocksWithWaste}
            </div>
            <div>
              <span className="text-white/55">Mortier (simple):</span> {output.mortarEstimateM3 === null ? "—" : `${output.mortarEstimateM3} m³`}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
            Renseigne les paramètres puis clique sur “Calculer”.
          </div>
        )}
      </Card>
    </div>
  );
}
