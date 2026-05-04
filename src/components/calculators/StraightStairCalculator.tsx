"use client";

import { useEffect, useMemo, useState } from "react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

import {
  computeStraightStair,
  StairStraightInputSchema,
  type StairStraightOutput,
} from "@/lib/calculators/stairStraight";

type StepsMode = "auto" | "manual";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function StraightStairCalculator() {
  const [stepsMode, setStepsMode] = useState<StepsMode>("auto");

  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([]);
  const [projectId, setProjectId] = useState("");

  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [history, setHistory] = useState<
    Array<{
      id: string;
      createdAt: string;
      totalHeightCm: unknown;
      availableLengthCm: unknown;
      stairWidthCm: unknown;
      stepsCount: number;
      riserHeightCm: unknown;
      treadDepthCm: unknown;
      comfortFormulaValue: unknown;
      comfortStatus: string;
      concreteVolumeWithLossM3: unknown;
      estimatedCost: unknown;
    }>
  >([]);

  const [totalHeightCm, setTotalHeightCm] = useState("280");
  const [availableLengthCm, setAvailableLengthCm] = useState("350");
  const [stairWidthCm, setStairWidthCm] = useState("110");
  const [stepsCount, setStepsCount] = useState("16");
  const [slabThicknessCm, setSlabThicknessCm] = useState("12");
  const [concreteDosageKgM3, setConcreteDosageKgM3] = useState("350");
  const [wasteMarginPercent, setWasteMarginPercent] = useState("8");
  const [pricePerM3, setPricePerM3] = useState("");

  const [output, setOutput] = useState<StairStraightOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState<string | null>(null);

  const comfortLabel = useMemo(() => {
    if (!output) return null;
    return {
      confortable: "Confortable",
      acceptable: "Acceptable",
      trop_raid: "Trop raide",
      giron_insuffisant: "Giron insuffisant",
      hauteur_excessive: "Hauteur de marche excessive",
    }[output.comfortStatus];
  }, [output]);

  function getNumericInput() {
    return {
      totalHeightCm: toNumber(totalHeightCm),
      availableLengthCm: toNumber(availableLengthCm),
      stairWidthCm: toNumber(stairWidthCm),
      slabThicknessCm: toNumber(slabThicknessCm),
      concreteDosageKgM3: toNumber(concreteDosageKgM3),
      wasteMarginPercent: toNumber(wasteMarginPercent),
      stepsMode,
      stepsCount: stepsMode === "manual" ? toNumber(stepsCount) : null,
      pricePerM3: toNumber(pricePerM3),
    };
  }

  async function refreshHistory(nextProjectId: string) {
    if (!nextProjectId) {
      setHistory([]);
      return;
    }

    setHistoryLoading(true);
    setHistoryError(null);
    const res = await fetch(`/api/calculators/stairs/straight?projectId=${encodeURIComponent(nextProjectId)}`);
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
  }

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

  function handleCompute() {
    setError(null);
    setSaveOk(null);
    setSaveError(null);

    const input = getNumericInput();

    const parsed = StairStraightInputSchema.safeParse({
      totalHeightCm: input.totalHeightCm ?? NaN,
      availableLengthCm: input.availableLengthCm ?? NaN,
      stairWidthCm: input.stairWidthCm ?? NaN,
      slabThicknessCm: input.slabThicknessCm ?? NaN,
      concreteDosageKgM3: input.concreteDosageKgM3 ?? NaN,
      wasteMarginPercent: input.wasteMarginPercent ?? NaN,
      stepsMode: input.stepsMode,
      stepsCount: stepsMode === "manual" ? (input.stepsCount ?? undefined) : undefined,
      pricePerM3: input.pricePerM3 ?? undefined,
    });

    if (!parsed.success) {
      setOutput(null);
      setError("Vérifie les champs numériques.");
      return;
    }

    try {
      const nextOutput = computeStraightStair(parsed.data);
      setOutput(nextOutput);
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

    const input = getNumericInput();
    const parsed = StairStraightInputSchema.safeParse({
      totalHeightCm: input.totalHeightCm ?? NaN,
      availableLengthCm: input.availableLengthCm ?? NaN,
      stairWidthCm: input.stairWidthCm ?? NaN,
      slabThicknessCm: input.slabThicknessCm ?? NaN,
      concreteDosageKgM3: input.concreteDosageKgM3 ?? NaN,
      wasteMarginPercent: input.wasteMarginPercent ?? NaN,
      stepsMode: input.stepsMode,
      stepsCount: stepsMode === "manual" ? (input.stepsCount ?? undefined) : undefined,
      pricePerM3: input.pricePerM3 ?? undefined,
    });

    if (!parsed.success) {
      setSaveError("Vérifie les champs numériques avant de sauvegarder.");
      return;
    }

    setSaveLoading(true);
    const res = await fetch("/api/calculators/stairs/straight", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        projectId,
        totalHeightCm: parsed.data.totalHeightCm,
        availableLengthCm: parsed.data.availableLengthCm,
        stairWidthCm: parsed.data.stairWidthCm,
        slabThicknessCm: parsed.data.slabThicknessCm,
        concreteDosageKgM3: parsed.data.concreteDosageKgM3,
        wasteMarginPercent: parsed.data.wasteMarginPercent,
        stepsMode: parsed.data.stepsMode,
        stepsCount: parsed.data.stepsMode === "manual" ? parsed.data.stepsCount : undefined,
        pricePerM3: parsed.data.pricePerM3,
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
          <CardDescription>Choisis le chantier où enregistrer ce calcul.</CardDescription>
        </CardHeader>

        <label className="block">
          <div className="mb-1 text-sm font-semibold text-white/85">Choisir un chantier</div>
          <select
            value={projectId}
            onChange={(e) => {
              const nextProjectId = e.target.value;
              setProjectId(nextProjectId);
              void refreshHistory(nextProjectId);
            }}
            className="h-11 w-full rounded-xl bg-white/5 px-3 text-sm text-white ring-1 ring-white/10 outline-none transition focus:ring-2 focus:ring-[var(--cp-accent)]"
          >
            <option value="">—</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          {projectsLoading ? <div className="mt-1 text-xs text-white/55">Chargement…</div> : null}
          {projectsError ? <div className="mt-1 text-xs text-[var(--cp-accent)]">{projectsError}</div> : null}
        </label>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>Entrées pour le calcul de l’escalier droit.</CardDescription>
        </CardHeader>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Hauteur totale à franchir (cm)"
          name="totalHeightCm"
          value={totalHeightCm}
          onChange={(e) => setTotalHeightCm(e.target.value)}
        />
        <Input
          label="Longueur disponible (cm)"
          name="availableLengthCm"
          value={availableLengthCm}
          onChange={(e) => setAvailableLengthCm(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Largeur de l’escalier (cm)"
          name="stairWidthCm"
          value={stairWidthCm}
          onChange={(e) => setStairWidthCm(e.target.value)}
        />
        <Input
          label="Épaisseur de paillasse (cm)"
          name="slabThicknessCm"
          value={slabThicknessCm}
          onChange={(e) => setSlabThicknessCm(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <div className="mb-1 text-sm font-semibold text-white/85">Nombre de marches</div>
          <select
            value={stepsMode}
            onChange={(e) => setStepsMode(e.target.value as StepsMode)}
            className="h-11 w-full rounded-xl bg-white/5 px-3 text-sm text-white ring-1 ring-white/10 outline-none transition focus:ring-2 focus:ring-[var(--cp-accent)]"
          >
            <option value="auto">Automatique</option>
            <option value="manual">Manuel</option>
          </select>
        </label>

        <Input
          label="Nombre de marches (manuel)"
          name="stepsCount"
          value={stepsCount}
          onChange={(e) => setStepsCount(e.target.value)}
          disabled={stepsMode !== "manual"}
        />

        <div />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Input
          label="Dosage béton (kg/m³)"
          name="concreteDosageKgM3"
          value={concreteDosageKgM3}
          onChange={(e) => setConcreteDosageKgM3(e.target.value)}
        />
        <Input
          label="Marge de perte (%)"
          name="wasteMarginPercent"
          value={wasteMarginPercent}
          onChange={(e) => setWasteMarginPercent(e.target.value)}
        />
        <Input
          label="Prix estimatif du m³ (optionnel)"
          name="pricePerM3"
          value={pricePerM3}
          onChange={(e) => setPricePerM3(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button type="button" variant="secondary" onClick={handleCompute}>
          Calculer
        </Button>
      </div>

      {error ? <div className="text-sm text-[var(--cp-accent)]">{error}</div> : null}

      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Résultats</CardTitle>
          <CardDescription>Confort et quantités estimatives.</CardDescription>
        </CardHeader>

        {output ? (
          <div className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="text-sm text-white/70">
                Nombre de marches: <span className="font-semibold text-white">{output.stepsCount}</span>
              </div>
              <div className="text-sm text-white/70">
                Hauteur de marche (H): <span className="font-semibold text-white">{output.riserHeightCm} cm</span>
              </div>
              <div className="text-sm text-white/70">
                Giron (G): <span className="font-semibold text-white">{output.goingCm} cm</span>
              </div>
              <div className="text-sm text-white/70">
                Confort (2H + G): <span className="font-semibold text-white">{output.comfortValueCm} cm</span>
              </div>
            </div>

            <div className="text-sm text-white/70">
              Conformité: <span className="font-semibold text-white">{comfortLabel}</span>
            </div>

            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div className="text-sm text-white/70">
                Longueur de paillasse: <span className="font-semibold text-white">{output.slabLengthM} m</span>
              </div>
              <div className="text-sm text-white/70">
                Volume béton: <span className="font-semibold text-white">{output.concreteVolumeM3} m³</span>
              </div>
              <div className="text-sm text-white/70">
                Volume béton + perte: <span className="font-semibold text-white">{output.concreteVolumeWithWasteM3} m³</span>
              </div>
              <div className="text-sm text-white/70">
                Surface coffrage: <span className="font-semibold text-white">{output.formworkAreaM2} m²</span>
              </div>
              <div className="text-sm text-white/70">
                Ciment estimatif: <span className="font-semibold text-white">{output.cementEstimateKg} kg</span>
              </div>
              <div className="text-sm text-white/70">
                Sable estimatif: <span className="font-semibold text-white">{output.sandEstimateM3} m³</span>
              </div>
              <div className="text-sm text-white/70">
                Gravier estimatif: <span className="font-semibold text-white">{output.gravelEstimateM3} m³</span>
              </div>
              {output.estimatedCost !== null ? (
                <div className="text-sm text-white/70">
                  Coût estimatif: <span className="font-semibold text-white">{output.estimatedCost}</span>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="text-sm text-white/60">Lance un calcul pour afficher les résultats.</div>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sauvegarde</CardTitle>
          <CardDescription>Enregistre ce calcul dans le chantier sélectionné.</CardDescription>
        </CardHeader>

        <div className="grid gap-3">
          <Button type="button" variant="secondary" onClick={handleSave} disabled={saveLoading}>
            Sauvegarder dans le chantier
          </Button>
          {saveError ? <div className="text-sm text-[var(--cp-accent)]">{saveError}</div> : null}
          {saveOk ? <div className="text-sm text-white/70">{saveOk}</div> : null}

          <div className="text-sm text-white/60">
            Les calculs sauvegardés restent estimatifs et doivent être validés par un professionnel selon les plans, les
            normes applicables et les conditions réelles du chantier.
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Derniers calculs sauvegardés</CardTitle>
          <CardDescription>Historique pour le chantier sélectionné.</CardDescription>
        </CardHeader>

        {historyError ? <div className="text-sm text-[var(--cp-accent)]">{historyError}</div> : null}
        {historyLoading ? <div className="text-sm text-white/60">Chargement…</div> : null}

        {!historyLoading && !historyError ? (
          history.length === 0 ? (
            <div className="text-sm text-white/60">Aucun calcul sauvegardé.</div>
          ) : (
            <div className="grid gap-2">
              {history.map((h) => (
                <div key={h.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="text-sm font-semibold text-white">
                    {new Date(h.createdAt).toLocaleDateString("fr-FR")} {new Date(h.createdAt).toLocaleTimeString("fr-FR")}
                  </div>
                  <div className="mt-1 text-xs text-white/55">
                    Marches: {h.stepsCount} • Confort: {h.comfortStatus}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : null}
      </Card>
    </div>
  );
}
