"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { canAccessFeature, type UserPlan } from "@/lib/subscription/access";
import { setPrintPayload } from "@/lib/calculations/printPayload";

import {
  computeConcrete,
  ConcreteElementTypeSchema,
  ConcreteInputSchema,
  type ConcreteOutput,
} from "@/lib/calculators/concrete";

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

const ELEMENT_LABEL: Record<string, string> = {
  dalle: "Dalle",
  poteau: "Poteau",
  poutre: "Poutre",
  semelle_isolee: "Semelle isolée",
  semelle_filante: "Semelle filante",
  longrine: "Longrine",
};

export function ConcreteCalculator() {
  const searchParams = useSearchParams();
  const projectIdFromUrl = searchParams.get("projectId")?.trim() || "";
  const userPlan = (searchParams.get("plan") as UserPlan | null) ?? "FREE";

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
      elementType: string;
      quantity: number;
      wasteMargin: unknown;
      volumeWithWaste: unknown;
      cementEstimateKg: unknown;
      sandEstimateM3: unknown;
      gravelEstimateM3: unknown;
    }>
  >([]);

  const [elementType, setElementType] = useState<string>("dalle");
  const [lengthM, setLengthM] = useState("6");
  const [widthM, setWidthM] = useState("4");
  const [heightM, setHeightM] = useState("0.12");
  const [quantity, setQuantity] = useState("1");
  const [concreteDosageKgM3, setConcreteDosageKgM3] = useState("350");
  const [wasteMarginPercent, setWasteMarginPercent] = useState("8");
  const [pricePerM3, setPricePerM3] = useState("");

  const [output, setOutput] = useState<ConcreteOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState<string | null>(null);

  const elementTypeOk = useMemo(() => ConcreteElementTypeSchema.safeParse(elementType).success, [elementType]);

  function buildParsedInput() {
    const elementParsed = ConcreteElementTypeSchema.safeParse(elementType);
    if (!elementParsed.success) return null;

    const numeric = getNumericInput();
    if (numeric.quantity === null || !Number.isInteger(numeric.quantity)) return null;

    const parsed = ConcreteInputSchema.safeParse({
      elementType: elementParsed.data,
      lengthM: numeric.lengthM ?? NaN,
      widthM: numeric.widthM ?? NaN,
      heightM: numeric.heightM ?? NaN,
      quantity: numeric.quantity,
      concreteDosageKgM3: numeric.concreteDosageKgM3 ?? NaN,
      wasteMarginPercent: numeric.wasteMarginPercent ?? NaN,
      pricePerM3: numeric.pricePerM3 ?? undefined,
    });

    return parsed.success ? parsed.data : null;
  }

  function getNumericInput() {
    return {
      elementType,
      lengthM: toNumber(lengthM),
      widthM: toNumber(widthM),
      heightM: toNumber(heightM),
      quantity: toNumber(quantity),
      concreteDosageKgM3: toNumber(concreteDosageKgM3),
      wasteMarginPercent: toNumber(wasteMarginPercent),
      pricePerM3: toNumber(pricePerM3),
    };
  }

  const refreshHistory = useCallback(async (nextProjectId: string) => {
    if (!nextProjectId) {
      setHistory([]);
      return;
    }

    setHistoryLoading(true);
    setHistoryError(null);
    const res = await fetch(`/api/calculators/concrete?projectId=${encodeURIComponent(nextProjectId)}`);
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

    if (!elementTypeOk) {
      setOutput(null);
      setError("Choisis un type d’élément valide.");
      return;
    }

    const parsedInput = buildParsedInput();
    if (!parsedInput) {
      setOutput(null);
      setError("Vérifie les champs numériques.");
      return;
    }

    try {
      setOutput(computeConcrete(parsedInput));
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
    const res = await fetch("/api/calculators/concrete", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        projectId,
        elementType: parsedInput.elementType,
        lengthM: parsedInput.lengthM,
        widthM: parsedInput.widthM,
        heightM: parsedInput.heightM,
        quantity: parsedInput.quantity,
        concreteDosageKgM3: parsedInput.concreteDosageKgM3,
        wasteMarginPercent: parsedInput.wasteMarginPercent,
        pricePerM3: parsedInput.pricePerM3,
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
            <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">Chargement…</div>
          ) : projectsError ? (
            <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">{projectsError}</div>
          ) : projects.length === 0 ? (
            <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
              <div className="text-sm font-semibold text-[var(--app-text)]">Aucun chantier</div>
              <div className="mt-1 text-sm text-[var(--app-text-muted)]">Crée d’abord un chantier pour sauvegarder.</div>
              <div className="mt-4">
                <Button href="/dashboard/projects/new" variant="secondary" size="sm">
                  Créer un chantier
                </Button>
              </div>
            </div>
          ) : (
            <select
              className="w-full rounded-xl border border-[var(--app-card-border)] bg-[var(--app-input-bg)] px-3 py-2 text-sm text-[var(--app-text)]"
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
            <div className="text-xs text-[var(--app-text-muted)]">Chantier sélectionné depuis la page projet.</div>
          ) : null}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>Volume + marge de perte + estimation matériaux.</CardDescription>
        </CardHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-[var(--app-text)]">Type d’élément</label>
            <select
              className="w-full rounded-xl border border-[var(--app-card-border)] bg-[var(--app-input-bg)] px-3 py-2 text-sm text-[var(--app-text)]"
              value={elementType}
              onChange={(e) => setElementType(e.target.value)}
            >
              {Object.keys(ELEMENT_LABEL).map((k) => (
                <option key={k} value={k}>
                  {ELEMENT_LABEL[k]}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Longueur (m)" value={lengthM} onChange={(e) => setLengthM(e.target.value)} />
            <Input label="Largeur (m)" value={widthM} onChange={(e) => setWidthM(e.target.value)} />
            <Input label="Hauteur/épaisseur (m)" value={heightM} onChange={(e) => setHeightM(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Quantité" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            <Input
              label="Dosage béton (kg/m³)"
              value={concreteDosageKgM3}
              onChange={(e) => setConcreteDosageKgM3(e.target.value)}
            />
            <Input
              label="Marge de perte (%)"
              value={wasteMarginPercent}
              onChange={(e) => setWasteMarginPercent(e.target.value)}
            />
          </div>

          <Input
            label="Prix estimatif du m³ (optionnel)"
            hint="Utile pour le coût estimatif, non sauvegardé pour le moment."
            value={pricePerM3}
            onChange={(e) => setPricePerM3(e.target.value)}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button type="button" variant="secondary" onClick={handleCompute}>
              Calculer
            </Button>
            <Button type="button" variant="ghost" onClick={handleSave} disabled={saveLoading}>
              {saveLoading ? "Sauvegarde…" : "Sauvegarder dans le chantier"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={!output || !canAccessFeature(userPlan, "calc_pdf")}
              onClick={() => {
                if (!output) return;

                setPrintPayload({
                  calculatorName: "Calcul béton",
                  createdAt: new Date().toISOString(),
                  warning: "Avertissement: document indicatif, à vérifier selon normes et chantier.",
                  input: {
                    elementType,
                    lengthM,
                    widthM,
                    heightM,
                    quantity,
                    concreteDosageKgM3,
                    wasteMarginPercent,
                    pricePerM3,
                    projectId,
                  },
                  output: output as unknown as Record<string, unknown>,
                });

                window.location.href = "/dashboard/calculations/print";
              }}
            >
              Exporter PDF
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={!output || !canAccessFeature(userPlan, "quote_from_calc")}
              onClick={() => {
                if (!output) return;

                const url = new URL(window.location.origin + "/dashboard/quotes");
                if (projectId) url.searchParams.set("projectId", projectId);
                url.searchParams.set("title", "Devis depuis calcul béton");
                url.searchParams.set("itemLabel", "Béton (m³)");
                url.searchParams.set("quantity", String(output.volumeWithWasteM3));
                url.searchParams.set("unitPrice", "");
                window.location.href = url.pathname + url.search;
              }}
            >
              Créer un devis avec ce calcul
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
          <div className="grid gap-2 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Volume brut:</span> {output.volumeTotalM3} m³
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Volume avec perte:</span> {output.volumeWithWasteM3} m³
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Ciment:</span> {output.cementBagsCount} sac(s) (~{output.cementEstimateKg} kg)
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Sable:</span> {output.sandEstimateM3} m³
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Gravier:</span> {output.gravelEstimateM3} m³
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Eau indicative:</span> {output.waterEstimateL} L
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Coût estimatif:</span> {output.estimatedCost ? `${output.estimatedCost} FCFA` : "—"}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
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
          <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">Chargement…</div>
        ) : historyError ? (
          <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">{historyError}</div>
        ) : history.length === 0 ? (
          <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            Aucun calcul béton sauvegardé pour le moment.
          </div>
        ) : (
          <div className="grid gap-2">
            {history.map((h) => (
              <div key={h.id} className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-[var(--app-text)]">{ELEMENT_LABEL[h.elementType] ?? h.elementType}</div>
                    <div className="mt-1 text-xs text-[var(--app-text-muted)]">
                      {new Date(h.createdAt).toLocaleDateString("fr-FR")} • Qté: {h.quantity}
                    </div>
                  </div>
                  <div className="shrink-0 text-sm font-bold text-[var(--app-text)]">{String(h.volumeWithWaste)} m³</div>
                </div>
                <div className="mt-2 text-xs text-[var(--app-text-muted)]">
                  Ciment: {String(h.cementEstimateKg)} kg • Sable: {String(h.sandEstimateM3)} m³ • Gravier: {String(h.gravelEstimateM3)} m³
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
