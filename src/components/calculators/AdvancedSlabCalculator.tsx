"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { canAccessFeature, type UserPlan } from "@/lib/subscription/access";

import {
  computeAdvancedSlab,
  AdvancedSlabInputSchema,
  type AdvancedSlabOutput,
} from "@/lib/calculators/advancedSlab";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function AdvancedSlabCalculator() {
  const searchParams = useSearchParams();
  const userPlan = (searchParams.get("plan") as UserPlan | null) ?? "FREE";
  const [lengthM, setLengthM] = useState("10");
  const [widthM, setWidthM] = useState("8");
  const [thicknessM, setThicknessM] = useState("0.12");
  const [meshKgPerM2, setMeshKgPerM2] = useState("2.2");
  const [wastePercent, setWastePercent] = useState("8");
  const [polyaneOverlapPercent, setPolyaneOverlapPercent] = useState("10");

  const [pricePerM3Concrete, setPricePerM3Concrete] = useState("");
  const [pricePerKgSteel, setPricePerKgSteel] = useState("");
  const [pricePerM2Polyane, setPricePerM2Polyane] = useState("");
  const [pricePerM2Formwork, setPricePerM2Formwork] = useState("");

  const [output, setOutput] = useState<AdvancedSlabOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCompute() {
    setError(null);

    const parsed = AdvancedSlabInputSchema.safeParse({
      lengthM: toNumber(lengthM) ?? NaN,
      widthM: toNumber(widthM) ?? NaN,
      thicknessM: toNumber(thicknessM) ?? NaN,
      meshKgPerM2: toNumber(meshKgPerM2) ?? NaN,
      wastePercent: toNumber(wastePercent) ?? 0,
      polyaneOverlapPercent: toNumber(polyaneOverlapPercent) ?? 0,
      pricePerM3Concrete: pricePerM3Concrete.trim() ? (toNumber(pricePerM3Concrete) ?? NaN) : undefined,
      pricePerKgSteel: pricePerKgSteel.trim() ? (toNumber(pricePerKgSteel) ?? NaN) : undefined,
      pricePerM2Polyane: pricePerM2Polyane.trim() ? (toNumber(pricePerM2Polyane) ?? NaN) : undefined,
      pricePerM2Formwork: pricePerM2Formwork.trim() ? (toNumber(pricePerM2Formwork) ?? NaN) : undefined,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les champs numériques.");
      return;
    }

    try {
      setOutput(computeAdvancedSlab(parsed.data));
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
          <CardDescription>Béton, treillis/acier, polyane, coffrage périphérique.</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Longueur (m)" value={lengthM} onChange={(e) => setLengthM(e.target.value)} />
            <Input label="Largeur (m)" value={widthM} onChange={(e) => setWidthM(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Épaisseur (m)" value={thicknessM} onChange={(e) => setThicknessM(e.target.value)} />
            <Input label="Treillis/acier (kg/m²)" value={meshKgPerM2} onChange={(e) => setMeshKgPerM2(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Pertes (%)" value={wastePercent} onChange={(e) => setWastePercent(e.target.value)} />
            <Input
              label="Polyane recouvrement (%)"
              value={polyaneOverlapPercent}
              onChange={(e) => setPolyaneOverlapPercent(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Prix béton (FCFA/m³, optionnel)"
              value={pricePerM3Concrete}
              onChange={(e) => setPricePerM3Concrete(e.target.value)}
            />
            <Input
              label="Prix acier (FCFA/kg, optionnel)"
              value={pricePerKgSteel}
              onChange={(e) => setPricePerKgSteel(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Prix polyane (FCFA/m², optionnel)"
              value={pricePerM2Polyane}
              onChange={(e) => setPricePerM2Polyane(e.target.value)}
            />
            <Input
              label="Prix coffrage (FCFA/m², optionnel)"
              value={pricePerM2Formwork}
              onChange={(e) => setPricePerM2Formwork(e.target.value)}
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
          <CardDescription>Résumé prêt pour devis (plus tard).</CardDescription>
        </CardHeader>

        {output ? (
          <div className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
            <div className="grid gap-2">
              <div>
                <span className="text-white/55">Surface:</span> {output.areaM2} m²
              </div>
              <div>
                <span className="text-white/55">Volume béton:</span> {output.concreteVolumeM3} m³
              </div>
              <div>
                <span className="text-white/55">Acier estimé:</span> {output.steelEstimateKg} kg
              </div>
              <div>
                <span className="text-white/55">Coffrage périphérique:</span> {output.edgeFormworkAreaM2} m²
              </div>
              <div>
                <span className="text-white/55">Film polyane:</span> {output.polyaneAreaM2} m²
              </div>
              <div>
                <span className="text-white/55">Coût estimé:</span> {output.estimatedCost === null ? "—" : `${output.estimatedCost} FCFA`}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/10 p-3 text-xs text-white/60">
              <div className="font-semibold text-white/80">Résumé</div>
              <div>Surface: {output.summary.areaM2} m²</div>
              <div>Épaisseur: {output.summary.thicknessM} m</div>
              <div>Béton: {output.summary.concreteVolumeM3} m³</div>
              <div>Acier: {output.summary.steelEstimateKg} kg</div>
              <div>Polyane: {output.summary.polyaneAreaM2} m²</div>
              <div>Coffrage périph.: {output.summary.edgeFormworkAreaM2} m²</div>
            </div>

            <div>
              <Button
                type="button"
                variant="ghost"
                disabled={!canAccessFeature(userPlan, "quote_from_calc")}
                onClick={() => {
                  const url = new URL(window.location.origin + "/dashboard/quotes");
                  url.searchParams.set("title", "Devis depuis dalle (avancé)");
                  url.searchParams.set("itemLabel", "Béton dalle (m³)");
                  url.searchParams.set("quantity", String(output.concreteVolumeM3));
                  url.searchParams.set("unitPrice", "");
                  window.location.href = url.pathname + url.search;
                }}
              >
                Créer un devis avec ce calcul
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
            Renseigne les paramètres puis clique sur “Calculer”.
          </div>
        )}
      </Card>

      <div className="text-xs text-white/50">MVP: ordres de grandeur. Pour ferraillage réel et portance, valider avec plans/ingénieur.</div>
    </div>
  );
}
