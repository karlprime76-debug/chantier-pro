"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

import { computeSepticTank, SepticTankInputSchema, type SepticTankOutput } from "@/lib/calculators/septicTank";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function SepticTankCalculator() {
  const [usersCount, setUsersCount] = useState("6");
  const [consumptionLPerPersonPerDay, setConsumptionLPerPersonPerDay] = useState("80");
  const [retentionDays, setRetentionDays] = useState("3");
  const [safetyMarginPercent, setSafetyMarginPercent] = useState("25");

  const [tankDepthM, setTankDepthM] = useState("1.6");
  const [tankWidthM, setTankWidthM] = useState("1.2");
  const [soakawayDays, setSoakawayDays] = useState("1");

  const [output, setOutput] = useState<SepticTankOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCompute() {
    setError(null);

    const parsed = SepticTankInputSchema.safeParse({
      usersCount: toNumber(usersCount) ?? NaN,
      consumptionLPerPersonPerDay: toNumber(consumptionLPerPersonPerDay) ?? NaN,
      retentionDays: toNumber(retentionDays) ?? NaN,
      safetyMarginPercent: toNumber(safetyMarginPercent) ?? 0,
      tankDepthM: toNumber(tankDepthM) ?? NaN,
      tankWidthM: toNumber(tankWidthM) ?? NaN,
      soakawayDays: toNumber(soakawayDays) ?? NaN,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les champs numériques.");
      return;
    }

    try {
      setOutput(computeSepticTank(parsed.data));
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
          <CardDescription>Débit journalier, rétention et marge de sécurité.</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nombre d’utilisateurs" value={usersCount} onChange={(e) => setUsersCount(e.target.value)} />
            <Input
              label="Conso. (L/personne/jour)"
              value={consumptionLPerPersonPerDay}
              onChange={(e) => setConsumptionLPerPersonPerDay(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Durée de rétention (jours)" value={retentionDays} onChange={(e) => setRetentionDays(e.target.value)} />
            <Input label="Marge sécurité (%)" value={safetyMarginPercent} onChange={(e) => setSafetyMarginPercent(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Profondeur fosse (m)" value={tankDepthM} onChange={(e) => setTankDepthM(e.target.value)} />
            <Input label="Largeur fosse (m)" value={tankWidthM} onChange={(e) => setTankWidthM(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Puisard (jours, approx)"
              value={soakawayDays}
              onChange={(e) => setSoakawayDays(e.target.value)}
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
          <CardDescription>Volume utile, dimensions proposées et puisard.</CardDescription>
        </CardHeader>

        {output ? (
          <div className="grid gap-2 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
            <div>
              <span className="text-white/55">Débit journalier:</span> {output.dailyFlowM3} m³/j
            </div>
            <div>
              <span className="text-white/55">Volume utile:</span> {output.usefulVolumeM3} m³
            </div>
            <div>
              <span className="text-white/55">Volume + marge:</span> {output.usefulVolumeWithMarginM3} m³
            </div>
            <div>
              <span className="text-white/55">Dimensions proposées:</span> {output.proposedTankLengthM} m × {output.proposedTankWidthM} m × {output.proposedTankDepthM} m
            </div>
            <div>
              <span className="text-white/55">Volume proposé:</span> {output.proposedTankVolumeM3} m³
            </div>
            <div>
              <span className="text-white/55">Volume puisard (approx):</span> {output.soakawayVolumeM3} m³
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
            Renseigne les paramètres puis clique sur “Calculer”.
          </div>
        )}
      </Card>

      <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-xs text-white/60">
        <div className="font-semibold text-white/80">Avertissement</div>
        <div>Calcul indicatif. Respecte les normes locales (dimensionnement, ventilation, distances, vidange, perméabilité du sol).</div>
      </div>
    </div>
  );
}
