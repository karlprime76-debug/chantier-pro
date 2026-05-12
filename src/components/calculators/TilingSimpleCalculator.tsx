"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { canAccessFeature, type UserPlan } from "@/lib/subscription/access";

import { computeTiling, TilingInputSchema, type TilingOutput } from "@/lib/calculators/tilingSimple";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function TilingSimpleCalculator() {
  const searchParams = useSearchParams();
  const userPlan = (searchParams.get("plan") as UserPlan | null) ?? "FREE";
  const [roomLengthM, setRoomLengthM] = useState("4");
  const [roomWidthM, setRoomWidthM] = useState("3");
  const [tileLengthCm, setTileLengthCm] = useState("60");
  const [tileWidthCm, setTileWidthCm] = useState("60");
  const [wastePercent, setWastePercent] = useState("10");
  const [tilesPerBox, setTilesPerBox] = useState("");

  const [output, setOutput] = useState<TilingOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCompute() {
    setError(null);

    const parsed = TilingInputSchema.safeParse({
      roomLengthM: toNumber(roomLengthM) ?? NaN,
      roomWidthM: toNumber(roomWidthM) ?? NaN,
      tileLengthCm: toNumber(tileLengthCm) ?? NaN,
      tileWidthCm: toNumber(tileWidthCm) ?? NaN,
      wastePercent: toNumber(wastePercent) ?? NaN,
      tilesPerBox: tilesPerBox.trim() ? Number(tilesPerBox) : undefined,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les champs numériques.");
      return;
    }

    try {
      setOutput(computeTiling(parsed.data));
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
          <CardDescription>Surface + carreaux + marge de perte.</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Longueur pièce (m)" value={roomLengthM} onChange={(e) => setRoomLengthM(e.target.value)} />
            <Input label="Largeur pièce (m)" value={roomWidthM} onChange={(e) => setRoomWidthM(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Longueur carreau (cm)" value={tileLengthCm} onChange={(e) => setTileLengthCm(e.target.value)} />
            <Input label="Largeur carreau (cm)" value={tileWidthCm} onChange={(e) => setTileWidthCm(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Marge de perte (%)" value={wastePercent} onChange={(e) => setWastePercent(e.target.value)} />
            <Input
              label="Carreaux par carton (optionnel)"
              value={tilesPerBox}
              onChange={(e) => setTilesPerBox(e.target.value)}
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
          <div className="grid gap-3 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Surface:</span> {output.areaM2} m²
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Carreaux:</span> {output.tilesCount}
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Carreaux + perte:</span> {output.tilesWithWaste}
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Cartons:</span> {output.boxesCount === null ? "—" : output.boxesCount}
            </div>

            <div className="pt-2">
              <Button
                type="button"
                variant="ghost"
                disabled={!canAccessFeature(userPlan, "quote_from_calc")}
                onClick={() => {
                  const url = new URL(window.location.origin + "/dashboard/quotes");
                  url.searchParams.set("title", "Devis depuis calcul carrelage");
                  url.searchParams.set("itemLabel", "Carrelage (m²)");
                  url.searchParams.set("quantity", String(output.areaM2));
                  url.searchParams.set("unitPrice", "");
                  window.location.href = url.pathname + url.search;
                }}
              >
                Créer un devis avec ce calcul
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            Renseigne les paramètres puis clique sur “Calculer”.
          </div>
        )}
      </Card>
    </div>
  );
}
