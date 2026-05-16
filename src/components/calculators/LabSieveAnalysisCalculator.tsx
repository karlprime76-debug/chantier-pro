"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { parseNumberFR } from "@/lib/forms/numbers";

import {
  computeLabSieveAnalysis,
  LabSieveAnalysisInputSchema,
  type LabSieveAnalysisOutput,
  type LabSieveRow,
} from "@/lib/calculators/labSieveAnalysis";

type RowState = { sieveMm: string; retainedG: string };

function buildDefaultRows(): RowState[] {
  return [
    { sieveMm: "5", retainedG: "120" },
    { sieveMm: "2.5", retainedG: "180" },
    { sieveMm: "1.25", retainedG: "160" },
    { sieveMm: "0.63", retainedG: "140" },
    { sieveMm: "0.315", retainedG: "110" },
    { sieveMm: "0.16", retainedG: "60" },
    { sieveMm: "0.08", retainedG: "20" },
  ];
}

export function LabSieveAnalysisCalculator() {
  const [totalMassG, setTotalMassG] = useState("800");
  const [rows, setRows] = useState<RowState[]>(buildDefaultRows());
  const [output, setOutput] = useState<LabSieveAnalysisOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalMassError = useMemo(() => {
    if (!totalMassG.trim()) return undefined;
    return parseNumberFR(totalMassG) === null ? "Nombre invalide" : undefined;
  }, [totalMassG]);

  const rowErrors = useMemo(() => {
    return rows.map((r) => {
      const sieveErr = r.sieveMm.trim() && parseNumberFR(r.sieveMm) === null ? "Nombre invalide" : undefined;
      const retainedErr = r.retainedG.trim() && parseNumberFR(r.retainedG) === null ? "Nombre invalide" : undefined;
      return { sieveMm: sieveErr, retainedG: retainedErr };
    });
  }, [rows]);

  const parsedRows = useMemo(() => {
    const out: LabSieveRow[] = [];
    for (const r of rows) {
      const sieveMm = parseNumberFR(r.sieveMm);
      const retainedG = parseNumberFR(r.retainedG);
      if (sieveMm === null || retainedG === null) continue;
      out.push({ sieveMm, retainedG });
    }
    return out;
  }, [rows]);

  function handleCompute() {
    setError(null);

    const parsed = LabSieveAnalysisInputSchema.safeParse({
      totalMassG: parseNumberFR(totalMassG) ?? NaN,
      rows: parsedRows,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Renseigne la masse totale et au moins 1 ligne de tamis valide.");
      return;
    }

    try {
      setOutput(computeLabSieveAnalysis(parsed.data));
    } catch {
      setOutput(null);
      setError("Calcul impossible avec ces valeurs.");
    }
  }

  function handleReset() {
    setTotalMassG("800");
    setRows(buildDefaultRows());
    setOutput(null);
    setError(null);
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>Analyse granulométrique : saisie par tamis (% retenu / passant cumulé).</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <Input
            label="Masse totale échantillon (g)"
            value={totalMassG}
            onChange={(e) => setTotalMassG(e.target.value)}
            error={totalMassError}
          />

          <div className="grid gap-2">
            <div className="text-sm font-semibold text-[var(--app-text)]">Tamis (mm) et masse retenue (g)</div>

            <div className="grid gap-2">
              {rows.map((r, idx) => (
                <div key={idx} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
                  <Input
                    label={`Tamis ${idx + 1} (mm)`}
                    value={r.sieveMm}
                    onChange={(e) => {
                      const next = [...rows];
                      next[idx] = { ...next[idx], sieveMm: e.target.value };
                      setRows(next);
                    }}
                    error={rowErrors[idx]?.sieveMm}
                  />
                  <Input
                    label={`Retenu ${idx + 1} (g)`}
                    value={r.retainedG}
                    onChange={(e) => {
                      const next = [...rows];
                      next[idx] = { ...next[idx], retainedG: e.target.value };
                      setRows(next);
                    }}
                    error={rowErrors[idx]?.retainedG}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setRows(rows.filter((_, i) => i !== idx))}
                    disabled={rows.length <= 1}
                    className="sm:mt-7"
                  >
                    Retirer
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                if (rows.length >= 20) return;
                setRows([...rows, { sieveMm: "", retainedG: "" }]);
              }}
              disabled={rows.length >= 20}
            >
              Ajouter un tamis
            </Button>
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
          <CardDescription>Tableau de synthèse.</CardDescription>
        </CardHeader>

        {output ? (
          <div className="grid gap-3">
            <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
              <div>
                <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Masse totale :</span> {output.totalMassG} g
              </div>
              <div>
                <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Somme retenus :</span> {output.sumRetainedG} g
              </div>
              <div>
                <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Écart (total - retenus) :</span> {output.diffG} g
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[var(--app-card-border)]">
              <table className="min-w-[720px] w-full text-sm">
                <thead className="bg-[color-mix(in_oklab,var(--app-card),transparent_6%)]">
                  <tr className="text-left text-[var(--app-text)]">
                    <th className="px-4 py-3">Tamis (mm)</th>
                    <th className="px-4 py-3">Retenu (g)</th>
                    <th className="px-4 py-3">Retenu (%)</th>
                    <th className="px-4 py-3">Retenu cumulé (%)</th>
                    <th className="px-4 py-3">Passant cumulé (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {output.rows.map((r) => (
                    <tr key={r.sieveMm} className="border-t border-[var(--app-card-border)] text-[var(--app-text-muted)]">
                      <td className="px-4 py-3 font-semibold text-[var(--app-text)]">{r.sieveMm}</td>
                      <td className="px-4 py-3">{r.retainedG}</td>
                      <td className="px-4 py-3">{r.retainedPercent}</td>
                      <td className="px-4 py-3">{r.retainedCumulativePercent}</td>
                      <td className="px-4 py-3">{r.passingCumulativePercent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            Renseigne les paramètres puis clique sur “Calculer”.
          </div>
        )}
      </Card>

      <div className="text-xs text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">
        Ces calculs servent d’aide au contrôle qualité. Les résultats doivent être interprétés selon les normes applicables, les procédures du
        laboratoire et la validation du responsable qualité.
      </div>
    </div>
  );
}
