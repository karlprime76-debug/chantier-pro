"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

import { computeEarthwork, EarthworkInputSchema, type EarthworkOutput } from "@/lib/calculators/earthwork";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function EarthworkCalculator() {
  const [lengthM, setLengthM] = useState("10");
  const [widthM, setWidthM] = useState("1");
  const [depthM, setDepthM] = useState("1");
  const [swellCoefficient, setSwellCoefficient] = useState("1.2");
  const [transportPricePerM3, setTransportPricePerM3] = useState("");

  const [output, setOutput] = useState<EarthworkOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCompute() {
    setError(null);

    const parsed = EarthworkInputSchema.safeParse({
      lengthM: toNumber(lengthM) ?? NaN,
      widthM: toNumber(widthM) ?? NaN,
      depthM: toNumber(depthM) ?? NaN,
      swellCoefficient: toNumber(swellCoefficient) ?? NaN,
      transportPricePerM3: transportPricePerM3.trim() ? (toNumber(transportPricePerM3) ?? NaN) : undefined,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les champs numériques.");
      return;
    }

    try {
      setOutput(computeEarthwork(parsed.data));
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
          <CardDescription>Volumes + foisonnement + coût transport.</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Longueur (m)" value={lengthM} onChange={(e) => setLengthM(e.target.value)} />
            <Input label="Largeur (m)" value={widthM} onChange={(e) => setWidthM(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Profondeur (m)" value={depthM} onChange={(e) => setDepthM(e.target.value)} />
            <Input label="Coeff. foisonnement" value={swellCoefficient} onChange={(e) => setSwellCoefficient(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Prix transport (FCFA/m³, optionnel)"
              value={transportPricePerM3}
              onChange={(e) => setTransportPricePerM3(e.target.value)}
            />
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
          <CardDescription>Déblais et volume à évacuer.</CardDescription>
        </CardHeader>

        {output ? (
          <div className="grid gap-2 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
            <div>
              <span className="text-white/55">Volume déblais:</span> {output.excavationVolumeM3} m³
            </div>
            <div>
              <span className="text-white/55">Volume à évacuer:</span> {output.volumeToEvacuateM3} m³
            </div>
            <div>
              <span className="text-white/55">Coût transport:</span> {output.estimatedTransportCost === null ? "—" : `${output.estimatedTransportCost} FCFA`}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
            Renseigne les paramètres puis clique sur “Calculer”.
          </div>
        )}
      </Card>

      <div className="text-xs text-white/50">Le foisonnement dépend du sol (argile, sable, latérite…). Ajuste selon tes habitudes.</div>
    </div>
  );
}
