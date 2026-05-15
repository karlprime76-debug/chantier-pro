"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function clampNonNegative(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, n);
}

function formatFcfa(n: number): string {
  const v = Number.isFinite(n) ? n : 0;
  return `${new Intl.NumberFormat("fr-FR").format(Math.round(v))} FCFA`;
}

export function EnterpriseEstimationCalculator() {
  const [projectName, setProjectName] = useState("");
  const [workType, setWorkType] = useState("Bâtiment");
  const [surfaceM2, setSurfaceM2] = useState("100");

  const [costConcrete, setCostConcrete] = useState("0");
  const [costSteel, setCostSteel] = useState("0");
  const [costMasonry, setCostMasonry] = useState("0");
  const [costPlaster, setCostPlaster] = useState("0");
  const [costTiling, setCostTiling] = useState("0");
  const [costPainting, setCostPainting] = useState("0");
  const [costRoofing, setCostRoofing] = useState("0");

  const [laborCost, setLaborCost] = useState("0");
  const [otherFees, setOtherFees] = useState("0");
  const [marginPercent, setMarginPercent] = useState("10");

  const [computed, setComputed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    if (!computed) return null;

    const surface = toNumber(surfaceM2) ?? 0;

    const totalMaterials =
      clampNonNegative(toNumber(costConcrete) ?? 0) +
      clampNonNegative(toNumber(costSteel) ?? 0) +
      clampNonNegative(toNumber(costMasonry) ?? 0) +
      clampNonNegative(toNumber(costPlaster) ?? 0) +
      clampNonNegative(toNumber(costTiling) ?? 0) +
      clampNonNegative(toNumber(costPainting) ?? 0) +
      clampNonNegative(toNumber(costRoofing) ?? 0);

    const labor = clampNonNegative(toNumber(laborCost) ?? 0);
    const fees = clampNonNegative(toNumber(otherFees) ?? 0);
    const margin = clampNonNegative(toNumber(marginPercent) ?? 0);

    const totalBeforeMargin = totalMaterials + labor + fees;
    const marginAmount = totalBeforeMargin * (margin / 100);
    const totalEstimate = totalBeforeMargin + marginAmount;

    const costPerM2 = surface > 0 ? totalEstimate / surface : null;

    return {
      surface,
      totalMaterials,
      labor,
      fees,
      margin,
      totalBeforeMargin,
      marginAmount,
      totalEstimate,
      costPerM2,
    };
  }, [
    computed,
    surfaceM2,
    costConcrete,
    costSteel,
    costMasonry,
    costPlaster,
    costTiling,
    costPainting,
    costRoofing,
    laborCost,
    otherFees,
    marginPercent,
  ]);

  function handleCompute() {
    setError(null);

    const surface = toNumber(surfaceM2);
    if (surface === null) {
      setComputed(false);
      setError("Renseigne une surface valide (m²). Pour le coût/m², la surface doit être > 0.");
      return;
    }

    const valuesToCheck = [
      costConcrete,
      costSteel,
      costMasonry,
      costPlaster,
      costTiling,
      costPainting,
      costRoofing,
      laborCost,
      otherFees,
      marginPercent,
    ];

    const invalid = valuesToCheck.some((v) => {
      const n = toNumber(v);
      return n === null || !Number.isFinite(n);
    });

    if (invalid) {
      setComputed(false);
      setError("Vérifie les montants et le pourcentage de marge.");
      return;
    }

    const negative = valuesToCheck.some((v) => (toNumber(v) ?? 0) < 0);
    if (negative) {
      setComputed(false);
      setError("Les montants négatifs ne sont pas autorisés.");
      return;
    }

    setComputed(true);
  }

  function handleReset() {
    setProjectName("");
    setWorkType("Bâtiment");
    setSurfaceM2("100");
    setCostConcrete("0");
    setCostSteel("0");
    setCostMasonry("0");
    setCostPlaster("0");
    setCostTiling("0");
    setCostPainting("0");
    setCostRoofing("0");
    setLaborCost("0");
    setOtherFees("0");
    setMarginPercent("10");
    setComputed(false);
    setError(null);
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>Montants indicatifs pour une estimation globale (Entreprise).</CardDescription>
        </CardHeader>

        <div className="grid gap-4 px-6 pb-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nom du projet" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
            <Input label="Type d’ouvrage" value={workType} onChange={(e) => setWorkType(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Surface (m²)" value={surfaceM2} onChange={(e) => setSurfaceM2(e.target.value)} inputMode="decimal" />
            <Input
              label="Marge (%)"
              value={marginPercent}
              onChange={(e) => setMarginPercent(e.target.value)}
              inputMode="decimal"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Coût béton" value={costConcrete} onChange={(e) => setCostConcrete(e.target.value)} inputMode="decimal" />
            <Input label="Coût acier" value={costSteel} onChange={(e) => setCostSteel(e.target.value)} inputMode="decimal" />
            <Input
              label="Coût maçonnerie"
              value={costMasonry}
              onChange={(e) => setCostMasonry(e.target.value)}
              inputMode="decimal"
            />
            <Input label="Coût enduit" value={costPlaster} onChange={(e) => setCostPlaster(e.target.value)} inputMode="decimal" />
            <Input
              label="Coût carrelage"
              value={costTiling}
              onChange={(e) => setCostTiling(e.target.value)}
              inputMode="decimal"
            />
            <Input
              label="Coût peinture"
              value={costPainting}
              onChange={(e) => setCostPainting(e.target.value)}
              inputMode="decimal"
            />
            <Input
              label="Coût toiture"
              value={costRoofing}
              onChange={(e) => setCostRoofing(e.target.value)}
              inputMode="decimal"
            />
            <div />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Coût main-d’œuvre" value={laborCost} onChange={(e) => setLaborCost(e.target.value)} inputMode="decimal" />
            <Input label="Autres frais" value={otherFees} onChange={(e) => setOtherFees(e.target.value)} inputMode="decimal" />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={handleCompute}>
              Calculer
            </Button>
            <Button type="button" variant="ghost" onClick={handleReset}>
              Réinitialiser
            </Button>
          </div>

          {error ? <div className="text-sm text-[var(--cp-accent)]">{error}</div> : null}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Résultats</CardTitle>
          <CardDescription>Totaux + coût estimatif au m².</CardDescription>
        </CardHeader>

        {result ? (
          <div className="grid gap-2 px-6 pb-6 text-sm text-[var(--app-text-muted)]">
            <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
              <div className="text-sm font-bold text-[var(--app-text)]">Résumé projet</div>
              <div className="mt-1">
                <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Projet:</span> {projectName || "(non renseigné)"}
              </div>
              <div>
                <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Ouvrage:</span> {workType || "(non renseigné)"}
              </div>
              <div>
                <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Surface:</span> {result.surface} m²
              </div>
            </div>

            <div className="grid gap-2 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
              <div>
                <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Total matériaux:</span> {formatFcfa(result.totalMaterials)}
              </div>
              <div>
                <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Main-d’œuvre:</span> {formatFcfa(result.labor)}
              </div>
              <div>
                <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Autres frais:</span> {formatFcfa(result.fees)}
              </div>
              <div>
                <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Total hors marge:</span> {formatFcfa(result.totalBeforeMargin)}
              </div>
              <div>
                <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Marge ({result.margin}%):</span> {formatFcfa(result.marginAmount)}
              </div>
              <div className="pt-2 text-base font-extrabold text-[var(--app-text)]">
                Total estimatif: {formatFcfa(result.totalEstimate)}
              </div>
              <div>
                <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Coût / m²:</span>{" "}
                {result.costPerM2 === null ? (
                  <span>Surface invalide (doit être &gt; 0).</span>
                ) : (
                  <span className="font-bold text-[var(--app-text)]">{formatFcfa(result.costPerM2)}</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="px-6 pb-6">
            <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
              Renseigne les paramètres puis clique sur “Calculer”.
            </div>
          </div>
        )}
      </Card>

      <div className="text-xs text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">
        Les résultats sont des estimations d’aide au chantier. Ils doivent être vérifiés selon les plans, les normes applicables et les
        conditions réelles du projet. Ce calcul ne remplace pas une étude technique, ni la validation d’un ingénieur.
      </div>
    </div>
  );
}
