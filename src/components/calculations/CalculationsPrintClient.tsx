"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

type Payload = {
  calculatorName: string;
  createdAt: string;
  warning: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
};

function safeJsonParse(str: string): Payload | null {
  try {
    const v = JSON.parse(str) as unknown;
    if (!v || typeof v !== "object") return null;
    return v as Payload;
  } catch {
    return null;
  }
}

function todayLabel() {
  return new Date().toLocaleString("fr-FR");
}

export function CalculationsPrintClient() {
  const [calculatorName, setCalculatorName] = useState("Calcul Chantier Pro");
  const [warning, setWarning] = useState("Avertissement: document indicatif, à vérifier selon normes et chantier.");

  const [inputJson, setInputJson] = useState('{"longueur":10,"largeur":8,"epaisseur":0.12}');
  const [outputJson, setOutputJson] = useState('{"volume_beton":9.6,"acier_estime":176}');

  const input = useMemo(() => safeJsonParse(inputJson), [inputJson]);
  const output = useMemo(() => safeJsonParse(outputJson), [outputJson]);

  return (
    <div className="grid gap-4">
      <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
        MVP: pour exporter un calcul en PDF, utilise une page “imprimable” puis “Enregistrer en PDF”.
      </div>

      <Card className="print:hidden">
        <CardHeader>
          <CardTitle>Préparer l’export</CardTitle>
          <CardDescription>Pour l’instant, colle tes données (JSON) puis imprime.</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <Input label="Nom du calcul" value={calculatorName} onChange={(e) => setCalculatorName(e.target.value)} />
          <Input label="Avertissement technique" value={warning} onChange={(e) => setWarning(e.target.value)} />

          <label className="block">
            <div className="mb-1 text-sm font-semibold text-white/85">Entrées (JSON)</div>
            <textarea
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              className="min-h-[120px] w-full rounded-xl bg-white/5 px-3 py-2 text-sm text-white ring-1 ring-white/10 outline-none transition focus:ring-2 focus:ring-[var(--cp-accent)]"
            />
          </label>

          <label className="block">
            <div className="mb-1 text-sm font-semibold text-white/85">Résultats (JSON)</div>
            <textarea
              value={outputJson}
              onChange={(e) => setOutputJson(e.target.value)}
              className="min-h-[120px] w-full rounded-xl bg-white/5 px-3 py-2 text-sm text-white ring-1 ring-white/10 outline-none transition focus:ring-2 focus:ring-[var(--cp-accent)]"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={() => window.print()}>
              Imprimer / Enregistrer en PDF
            </Button>
          </div>

          {!input || !output ? (
            <div className="text-sm text-[var(--cp-accent)]">JSON invalide (entrées ou résultats).</div>
          ) : null}
        </div>
      </Card>

      <div className="hidden print:block">
        <div className="mb-6 flex items-center justify-between border-b border-black/10 pb-3">
          <div>
            <div className="text-xl font-extrabold">Chantier Pro</div>
            <div className="text-sm">{todayLabel()}</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{calculatorName}</div>
          </div>
        </div>

        <div className="grid gap-6">
          <div>
            <div className="text-sm font-bold">Entrées</div>
            <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-black/5 p-3 text-xs">{inputJson}</pre>
          </div>

          <div>
            <div className="text-sm font-bold">Résultats</div>
            <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-black/5 p-3 text-xs">{outputJson}</pre>
          </div>

          <div className="rounded-lg border border-black/10 bg-black/5 p-3 text-xs">
            <div className="font-bold">Avertissement</div>
            <div className="mt-1">{warning}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
