"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

import {
  computeMasonryAdvanced,
  MasonryAdvancedInputSchema,
  MasonryBlockTypeSchema,
  type MasonryAdvancedOutput,
} from "@/lib/calculators/masonryAdvanced";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

const BLOCK_TYPES: Array<{ id: string; label: string }> = [
  { id: "BLOCK_15", label: "Agglo 15" },
  { id: "BLOCK_20", label: "Agglo 20" },
  { id: "BRICK_10", label: "Brique" },
];

export function AdvancedMasonryCalculator() {
  const [wallLengthM, setWallLengthM] = useState("10");
  const [wallHeightM, setWallHeightM] = useState("2.8");
  const [thicknessCm, setThicknessCm] = useState("20");
  const [blockType, setBlockType] = useState<string>("BLOCK_20");
  const [openingsAreaM2, setOpeningsAreaM2] = useState("1.8");
  const [wastePercent, setWastePercent] = useState("8");

  const [output, setOutput] = useState<MasonryAdvancedOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const blockTypeOk = useMemo(() => MasonryBlockTypeSchema.safeParse(blockType).success, [blockType]);

  function handleCompute() {
    setError(null);

    if (!blockTypeOk) {
      setOutput(null);
      setError("Choisis un type de bloc valide.");
      return;
    }

    const parsed = MasonryAdvancedInputSchema.safeParse({
      wallLengthM: toNumber(wallLengthM) ?? NaN,
      wallHeightM: toNumber(wallHeightM) ?? NaN,
      thicknessCm: toNumber(thicknessCm) ?? NaN,
      blockType,
      openingsAreaM2: toNumber(openingsAreaM2) ?? 0,
      wastePercent: toNumber(wastePercent) ?? 0,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les champs numériques.");
      return;
    }

    try {
      setOutput(computeMasonryAdvanced(parsed.data));
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
          <CardDescription>Surface brute, ouvertures, perte et type de bloc.</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Longueur du mur (m)" value={wallLengthM} onChange={(e) => setWallLengthM(e.target.value)} />
            <Input label="Hauteur du mur (m)" value={wallHeightM} onChange={(e) => setWallHeightM(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Épaisseur (cm)" value={thicknessCm} onChange={(e) => setThicknessCm(e.target.value)} />

            <label className="block">
              <div className="mb-1 text-sm font-semibold text-white/85">Type bloc</div>
              <select
                value={blockType}
                onChange={(e) => setBlockType(e.target.value)}
                className="h-11 w-full rounded-xl bg-white/5 px-3 text-sm text-white ring-1 ring-white/10 outline-none transition focus:ring-2 focus:ring-[var(--cp-accent)]"
              >
                {BLOCK_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Surface ouvertures (m²)"
              value={openingsAreaM2}
              onChange={(e) => setOpeningsAreaM2(e.target.value)}
            />
            <Input label="Perte (%)" value={wastePercent} onChange={(e) => setWastePercent(e.target.value)} />
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
          <CardDescription>Blocs + mortier (estimation).</CardDescription>
        </CardHeader>

        {output ? (
          <div className="grid gap-2 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
            <div>
              <span className="text-white/55">Surface brute:</span> {output.grossAreaM2} m²
            </div>
            <div>
              <span className="text-white/55">Surface nette:</span> {output.netAreaM2} m²
            </div>
            <div>
              <span className="text-white/55">Nombre de blocs:</span> {output.blocksCount}
            </div>
            <div>
              <span className="text-white/55">Mortier estimé:</span> {output.mortarEstimateM3} m³
            </div>
            <div>
              <span className="text-white/55">Ciment (sacs 50kg):</span> {output.mortarBagsCement50Kg}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
            Renseigne les paramètres puis clique sur “Calculer”.
          </div>
        )}
      </Card>

      <div className="text-xs text-white/50">
        Estimations indicatives (mortier/ciment) : à ajuster selon le chantier, le type de bloc et la qualité de pose.
      </div>
    </div>
  );
}
