"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

import { computeSteel, SteelDiameterSchema, SteelInputSchema, type SteelOutput } from "@/lib/calculators/steel";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

const DIAMETERS: Array<{ key: string; label: string }> = [
  { key: "HA6", label: "HA6" },
  { key: "HA8", label: "HA8" },
  { key: "HA10", label: "HA10" },
  { key: "HA12", label: "HA12" },
  { key: "HA14", label: "HA14" },
  { key: "HA16", label: "HA16" },
  { key: "HA20", label: "HA20" },
  { key: "HA25", label: "HA25" },
];

export function SteelCalculator() {
  const searchParams = useSearchParams();
  const projectIdFromUrl = searchParams.get("projectId")?.trim() || "";

  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([]);
  const [projectId, setProjectId] = useState(projectIdFromUrl);
  const [projectPrefilledFromUrl] = useState(Boolean(projectIdFromUrl));

  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [history, setHistory] = useState<
    Array<{
      id: string;
      createdAt: string;
      diameterMm: number;
      totalLengthM: unknown;
      totalWeightKg: unknown;
      bars12mCount: number | null;
      estimatedCost: unknown;
    }>
  >([]);

  const [diameter, setDiameter] = useState<string>("HA12");
  const [unitLengthM, setUnitLengthM] = useState("3.2");
  const [count, setCount] = useState("20");
  const [overlapM, setOverlapM] = useState("0.4");
  const [lossPercent, setLossPercent] = useState("5");
  const [pricePerKg, setPricePerKg] = useState("");
  const [pricePerBar, setPricePerBar] = useState("");

  const [output, setOutput] = useState<SteelOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState<string | null>(null);

  const diameterOk = useMemo(() => SteelDiameterSchema.safeParse(diameter).success, [diameter]);

  function buildParsedInput() {
    const diameterParsed = SteelDiameterSchema.safeParse(diameter);
    if (!diameterParsed.success) return null;

    const numeric = getNumericInput();
    if (numeric.count === null || !Number.isInteger(numeric.count)) return null;

    const parsed = SteelInputSchema.safeParse({
      diameter: diameterParsed.data,
      unitLengthM: numeric.unitLengthM ?? NaN,
      count: numeric.count,
      overlapM: numeric.overlapM ?? NaN,
      lossPercent: numeric.lossPercent ?? NaN,
      pricePerKg: numeric.pricePerKg ?? undefined,
      pricePerBar: numeric.pricePerBar ?? undefined,
    });

    return parsed.success ? parsed.data : null;
  }

  function getNumericInput() {
    return {
      diameter,
      unitLengthM: toNumber(unitLengthM),
      count: toNumber(count),
      overlapM: toNumber(overlapM),
      lossPercent: toNumber(lossPercent),
      pricePerKg: toNumber(pricePerKg),
      pricePerBar: toNumber(pricePerBar),
    };
  }

  const refreshHistory = useCallback(async (nextProjectId: string) => {
    if (!nextProjectId) {
      setHistory([]);
      return;
    }

    setHistoryLoading(true);
    setHistoryError(null);
    const res = await fetch(`/api/calculators/steel?projectId=${encodeURIComponent(nextProjectId)}`);
    const data = (await res.json().catch(() => null)) as
      | { ok: true; calculations: typeof history }
      | { ok: false; error: string }
      | null;

    if (!res.ok || !data || data.ok !== true) {
      setHistoryError("Impossible de charger l’historique.");
      setHistory([]);
      setHistoryLoading(false);
      return;
    }

    setHistory(data.calculations);
    setHistoryLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      setProjectsLoading(true);
      setProjectsError(null);
      const res = await fetch("/api/projects");
      const data = (await res.json().catch(() => null)) as
        | { ok: true; projects: Array<{ id: string; name: string }> }
        | { ok: false; error: string }
        | null;

      if (cancelled) return;
      if (!res.ok || !data || data.ok !== true) {
        setProjectsError("Impossible de charger les chantiers.");
        setProjects([]);
        setProjectsLoading(false);
        return;
      }

      setProjects(data.projects.map((p) => ({ id: p.id, name: p.name })));
      setProjectsLoading(false);
    }

    void loadProjects();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!projectIdFromUrl) return;
    if (projectsLoading) return;
    if (projects.length === 0) return;
    if (projectId !== projectIdFromUrl) return;

    const exists = projects.some((p) => p.id === projectIdFromUrl);
    if (!exists) return;

    const t = setTimeout(() => {
      void refreshHistory(projectIdFromUrl);
    }, 0);

    return () => clearTimeout(t);
  }, [projectIdFromUrl, projectId, projectsLoading, projects, refreshHistory]);

  function handleCompute() {
    setError(null);
    setSaveOk(null);
    setSaveError(null);

    if (!diameterOk) {
      setOutput(null);
      setError("Choisis un diamètre valide.");
      return;
    }

    const parsedInput = buildParsedInput();
    if (!parsedInput) {
      setOutput(null);
      setError("Vérifie les champs numériques.");
      return;
    }

    try {
      setOutput(computeSteel(parsedInput));
    } catch {
      setOutput(null);
      setError("Calcul impossible avec ces valeurs.");
    }
  }

  async function handleSave() {
    setSaveOk(null);
    setSaveError(null);

    if (!projectId) {
      setSaveError("Choisis un chantier pour sauvegarder ce calcul.");
      return;
    }
    if (!output) {
      setSaveError("Fais d’abord un calcul.");
      return;
    }

    const parsedInput = buildParsedInput();
    if (!parsedInput) {
      setSaveError("Vérifie les champs numériques avant de sauvegarder.");
      return;
    }

    setSaveLoading(true);
    const res = await fetch("/api/calculators/steel", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        projectId,
        diameter: parsedInput.diameter,
        unitLengthM: parsedInput.unitLengthM,
        count: parsedInput.count,
        overlapM: parsedInput.overlapM,
        lossPercent: parsedInput.lossPercent,
        pricePerKg: parsedInput.pricePerKg,
        pricePerBar: parsedInput.pricePerBar,
      }),
    });

    const data = (await res.json().catch(() => null)) as
      | { ok: true; calculationId: string }
      | { ok: false; error: string }
      | null;

    if (!res.ok || !data || data.ok !== true) {
      setSaveError("Sauvegarde impossible. Vérifie le chantier et réessaie.");
      setSaveLoading(false);
      return;
    }

    setSaveOk("Calcul sauvegardé.");
    setSaveLoading(false);
    await refreshHistory(projectId);
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Chantier</CardTitle>
          <CardDescription>Choisis un chantier pour calculer et sauvegarder.</CardDescription>
        </CardHeader>
        <div className="grid gap-2">
          {projectsLoading ? (
            <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">Chargement…</div>
          ) : projectsError ? (
            <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">{projectsError}</div>
          ) : projects.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
              Aucun chantier. Crée d’abord un chantier pour sauvegarder.
            </div>
          ) : (
            <select
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
              value={projectId}
              onChange={(e) => {
                const next = e.target.value;
                setProjectId(next);
                setSaveOk(null);
                setSaveError(null);
                void refreshHistory(next);
              }}
            >
              <option value="">Choisir un chantier…</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}

          {projectPrefilledFromUrl && projectId === projectIdFromUrl ? (
            <div className="text-xs text-white/55">Chantier sélectionné depuis la page projet.</div>
          ) : null}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>Longueurs + poids + barres 12m + coût estimatif.</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-white">Diamètre</label>
            <select
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
              value={diameter}
              onChange={(e) => setDiameter(e.target.value)}
            >
              {DIAMETERS.map((d) => (
                <option key={d.key} value={d.key}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Longueur unitaire (m)" value={unitLengthM} onChange={(e) => setUnitLengthM(e.target.value)} />
            <Input label="Nombre de pièces" value={count} onChange={(e) => setCount(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Recouvrement (m)" value={overlapM} onChange={(e) => setOverlapM(e.target.value)} />
            <Input label="Perte (%)" value={lossPercent} onChange={(e) => setLossPercent(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Prix par kg (optionnel)" value={pricePerKg} onChange={(e) => setPricePerKg(e.target.value)} />
            <Input label="Prix par barre 12m (optionnel)" value={pricePerBar} onChange={(e) => setPricePerBar(e.target.value)} />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button type="button" variant="secondary" onClick={handleCompute}>
              Calculer
            </Button>
            <Button type="button" variant="ghost" onClick={handleSave} disabled={saveLoading}>
              {saveLoading ? "Sauvegarde…" : "Sauvegarder dans le chantier"}
            </Button>
          </div>

          {error ? <div className="text-sm text-rose-200">{error}</div> : null}
          {saveError ? <div className="text-sm text-rose-200">{saveError}</div> : null}
          {saveOk ? <div className="text-sm text-emerald-200">{saveOk}</div> : null}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Résultats</CardTitle>
          <CardDescription>Les résultats sont indicatifs.</CardDescription>
        </CardHeader>

        {output ? (
          <div className="grid gap-2 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
            <div>
              <span className="text-white/55">Diamètre:</span> {output.diameterMm} mm • {output.kgPerM} kg/m
            </div>
            <div>
              <span className="text-white/55">Longueur totale:</span> {output.totalLengthM} m
            </div>
            <div>
              <span className="text-white/55">Longueur avec perte:</span> {output.totalLengthWithLossM} m
            </div>
            <div>
              <span className="text-white/55">Poids total:</span> {output.totalWeightKg} kg
            </div>
            <div>
              <span className="text-white/55">Barres 12m:</span> {output.bars12mCount}
            </div>
            <div>
              <span className="text-white/55">Coût estimatif:</span> {output.estimatedCost ? `${output.estimatedCost} FCFA` : "—"}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
            Renseigne les paramètres puis clique sur “Calculer”.
          </div>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique</CardTitle>
          <CardDescription>Derniers calculs sauvegardés pour le chantier sélectionné.</CardDescription>
        </CardHeader>

        {historyLoading ? (
          <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">Chargement…</div>
        ) : historyError ? (
          <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">{historyError}</div>
        ) : history.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
            Aucun calcul acier sauvegardé pour le moment.
          </div>
        ) : (
          <div className="grid gap-2">
            {history.map((h) => (
              <div key={h.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-white">HA{h.diameterMm}</div>
                    <div className="mt-1 text-xs text-white/55">{new Date(h.createdAt).toLocaleDateString("fr-FR")}</div>
                  </div>
                  <div className="shrink-0 text-sm font-bold text-white">{String(h.totalWeightKg)} kg</div>
                </div>
                <div className="mt-2 text-xs text-white/55">
                  Longueur: {String(h.totalLengthM)} m • Barres 12m: {h.bars12mCount ?? "—"} • Coût: {h.estimatedCost ? `${String(h.estimatedCost)} FCFA` : "—"}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Note technique</CardTitle>
          <CardDescription>
            Les quantités et coûts sont estimatifs et doivent être validés par un professionnel selon les plans, les normes
            applicables et les conditions réelles du chantier.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
