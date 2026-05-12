"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { canAccessFeature, type UserPlan } from "@/lib/subscription/access";

import { computePaint, PaintInputSchema, type PaintOutput } from "@/lib/calculators/paint";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function PaintCalculator() {
  const searchParams = useSearchParams();
  const userPlan = (searchParams.get("plan") as UserPlan | null) ?? "FREE";
  const [roomLengthM, setRoomLengthM] = useState("4");
  const [roomWidthM, setRoomWidthM] = useState("3");
  const [wallHeightM, setWallHeightM] = useState("2.8");
  const [coatsCount, setCoatsCount] = useState("2");
  const [coverageM2PerL, setCoverageM2PerL] = useState("10");
  const [openingsAreaM2, setOpeningsAreaM2] = useState("0");
  const [wastePercent, setWastePercent] = useState("8");
  const [potCapacityL, setPotCapacityL] = useState("");

  const [output, setOutput] = useState<PaintOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCompute() {
    setError(null);

    const parsed = PaintInputSchema.safeParse({
      roomLengthM: toNumber(roomLengthM) ?? NaN,
      roomWidthM: toNumber(roomWidthM) ?? NaN,
      wallHeightM: toNumber(wallHeightM) ?? NaN,
      coatsCount: toNumber(coatsCount) ?? NaN,
      coverageM2PerL: toNumber(coverageM2PerL) ?? NaN,
      openingsAreaM2: toNumber(openingsAreaM2) ?? undefined,
      wastePercent: toNumber(wastePercent) ?? undefined,
      potCapacityL: potCapacityL.trim() ? Number(potCapacityL) : undefined,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les champs numériques.");
      return;
    }

    try {
      setOutput(computePaint(parsed.data));
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
          <CardDescription>Surfaces, rendement, couches et ouvertures.</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Longueur pièce (m)" value={roomLengthM} onChange={(e) => setRoomLengthM(e.target.value)} />
            <Input label="Largeur pièce (m)" value={roomWidthM} onChange={(e) => setRoomWidthM(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Hauteur murs (m)" value={wallHeightM} onChange={(e) => setWallHeightM(e.target.value)} />
            <Input label="Nombre de couches" value={coatsCount} onChange={(e) => setCoatsCount(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Rendement (m²/L)" value={coverageM2PerL} onChange={(e) => setCoverageM2PerL(e.target.value)} />
            <Input
              label="Surface ouvertures (m², optionnel)"
              value={openingsAreaM2}
              onChange={(e) => setOpeningsAreaM2(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Marge de perte (%)" value={wastePercent} onChange={(e) => setWastePercent(e.target.value)} />
            <Input label="Capacité pot (L, optionnel)" value={potCapacityL} onChange={(e) => setPotCapacityL(e.target.value)} />
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
          <CardDescription>Litres et pots estimatifs.</CardDescription>
        </CardHeader>

        {output ? (
          <div className="grid gap-3 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Surface murs brute:</span> {output.wallsAreaM2} m²
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Surface à peindre (couches):</span> {output.paintAreaM2} m²
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Litres nécessaires:</span> {output.litersNeeded} L
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Litres + perte:</span> {output.litersWithWaste} L
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Nombre de pots:</span> {output.potsCount === null ? "—" : output.potsCount}
            </div>

            <div className="pt-2">
              <Button
                type="button"
                variant="ghost"
                disabled={!canAccessFeature(userPlan, "quote_from_calc")}
                onClick={() => {
                  const url = new URL(window.location.origin + "/dashboard/quotes");
                  url.searchParams.set("title", "Devis depuis calcul peinture");
                  url.searchParams.set("itemLabel", "Peinture (L)");
                  url.searchParams.set("quantity", String(output.litersWithWaste));
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
