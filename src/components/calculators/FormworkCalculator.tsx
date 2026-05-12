"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

import {
  computeFormwork,
  FormworkElementTypeSchema,
  FormworkInputSchema,
  type FormworkOutput,
} from "@/lib/calculators/formwork";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

const ELEMENT_TYPES: Array<{ id: string; label: string }> = [
  { id: "SLAB", label: "Dalle" },
  { id: "BEAM", label: "Poutre" },
  { id: "COLUMN", label: "Poteau" },
  { id: "WALL", label: "Voile" },
];

export function FormworkCalculator() {
  const [elementType, setElementType] = useState<string>("SLAB");
  const [lengthM, setLengthM] = useState("6");
  const [widthM, setWidthM] = useState("4");
  const [heightM, setHeightM] = useState("0.12");
  const [thicknessM, setThicknessM] = useState("0.12");
  const [quantity, setQuantity] = useState("1");
  const [panelAreaM2, setPanelAreaM2] = useState("2.88");
  const [wastePercent, setWastePercent] = useState("8");
  const [pricePerM2, setPricePerM2] = useState("");

  const [output, setOutput] = useState<FormworkOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const elementTypeOk = useMemo(() => FormworkElementTypeSchema.safeParse(elementType).success, [elementType]);

  function handleCompute() {
    setError(null);

    if (!elementTypeOk) {
      setOutput(null);
      setError("Choisis un type d’élément valide.");
      return;
    }

    const parsed = FormworkInputSchema.safeParse({
      elementType,
      lengthM: toNumber(lengthM) ?? NaN,
      widthM: toNumber(widthM) ?? NaN,
      heightM: toNumber(heightM) ?? NaN,
      thicknessM: toNumber(thicknessM) ?? 0,
      quantity: toNumber(quantity) ?? NaN,
      panelAreaM2: toNumber(panelAreaM2) ?? NaN,
      wastePercent: toNumber(wastePercent) ?? 0,
      pricePerM2: pricePerM2.trim() ? (toNumber(pricePerM2) ?? NaN) : undefined,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les champs numériques.");
      return;
    }

    try {
      setOutput(computeFormwork(parsed.data));
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
          <CardDescription>Surfaces de coffrage et panneaux (estimation).</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <label className="block">
            <div className="mb-1 text-sm font-semibold text-[var(--app-text)]">Type d’élément</div>
            <select
              value={elementType}
              onChange={(e) => setElementType(e.target.value)}
              className="h-11 w-full rounded-xl bg-[var(--app-input-bg)] px-3 text-sm text-[var(--app-text)] ring-1 ring-[var(--app-card-border)] outline-none transition focus:ring-2 focus:ring-[var(--cp-accent)]"
            >
              {ELEMENT_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Longueur (m)" value={lengthM} onChange={(e) => setLengthM(e.target.value)} />
            <Input label="Largeur (m)" value={widthM} onChange={(e) => setWidthM(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Hauteur (m)" value={heightM} onChange={(e) => setHeightM(e.target.value)} />
            <Input label="Épaisseur (m)" value={thicknessM} onChange={(e) => setThicknessM(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Quantité" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            <Input label="Surface panneau (m²)" value={panelAreaM2} onChange={(e) => setPanelAreaM2(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Perte (%)" value={wastePercent} onChange={(e) => setWastePercent(e.target.value)} />
            <Input label="Coût (FCFA/m², optionnel)" value={pricePerM2} onChange={(e) => setPricePerM2(e.target.value)} />
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
          <CardDescription>Surface, panneaux, étaiement.</CardDescription>
        </CardHeader>

        {output ? (
          <div className="grid gap-2 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Surface coffrage:</span> {output.formworkSurfaceM2} m²
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Surface + perte:</span> {output.formworkSurfaceWithWasteM2} m²
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Panneaux:</span> {output.panelsCount}
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Étais (estimation):</span> {output.propsEstimate}
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
        Modèle simplifié (MVP) pour obtenir un ordre de grandeur rapide.
      </div>
    </div>
  );
}
