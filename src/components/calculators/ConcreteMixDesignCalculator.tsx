"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

import {
  calculateConcreteMix,
  ConcreteClassSchema,
  ConcreteDestinationSchema,
  ConcreteElementSchema,
  ConcreteMixInputSchema,
  type ConcreteMixOutput,
  MaxAggregateSchema,
  WorkabilitySchema,
} from "@/lib/calculators/concreteMixDesign";

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
  longrine: "Longrine",
  semelle: "Semelle",
  radier: "Radier",
  beton_de_proprete: "Béton de propreté",
  autre: "Autre",
};

const DESTINATION_LABEL: Record<string, string> = {
  beton_de_proprete: "Béton de propreté",
  beton_arme: "Béton armé",
  dallage: "Dallage",
  fondation: "Fondation",
  structure_courante: "Structure courante",
};

const WORKABILITY_LABEL: Record<string, string> = {
  ferme: "Ferme",
  plastique: "Plastique",
  fluide: "Fluide",
  slump_cm: "Affaissement (cm)",
};

const CLASS_HINT: Record<string, { ec: number }> = {
  "C12/15": { ec: 0.6 },
  "C16/20": { ec: 0.55 },
  "C20/25": { ec: 0.5 },
  "C25/30": { ec: 0.45 },
  "C30/37": { ec: 0.4 },
};

export function ConcreteMixDesignCalculator() {
  const [projectName, setProjectName] = useState("");
  const [element, setElement] = useState<string>("dalle");
  const [volumeM3, setVolumeM3] = useState("5");

  const [concreteClass, setConcreteClass] = useState<string>("C25/30");
  const [workability, setWorkability] = useState<string>("plastique");
  const [slumpCm, setSlumpCm] = useState("10");
  const [destination, setDestination] = useState<string>("structure_courante");
  const [maxAggregateMm, setMaxAggregateMm] = useState<string>("20");

  const [cementType, setCementType] = useState("CEM II");
  const [cementDensityKgM3, setCementDensityKgM3] = useState("3150");
  const [sandDensityKgM3, setSandDensityKgM3] = useState("1600");
  const [gravelDensityKgM3, setGravelDensityKgM3] = useState("1500");

  const [cementPrice, setCementPrice] = useState("");
  const [sandPrice, setSandPrice] = useState("");
  const [gravelPrice, setGravelPrice] = useState("");
  const [admixturePrice, setAdmixturePrice] = useState("");

  const [waterCementRatio, setWaterCementRatio] = useState("");
  const [waterLPerM3, setWaterLPerM3] = useState("");

  const [sandMoisturePct, setSandMoisturePct] = useState("0");
  const [gravelMoisturePct, setGravelMoisturePct] = useState("0");
  const [sandAbsorptionPct, setSandAbsorptionPct] = useState("0");
  const [gravelAbsorptionPct, setGravelAbsorptionPct] = useState("0");

  const [admixtureEnabled, setAdmixtureEnabled] = useState(false);
  const [admixtureMode, setAdmixtureMode] = useState<"pct_cement" | "l_per_m3">("pct_cement");
  const [admixturePctOfCement, setAdmixturePctOfCement] = useState("1");
  const [admixtureLPerM3, setAdmixtureLPerM3] = useState("2");

  const [output, setOutput] = useState<ConcreteMixOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const classOk = useMemo(() => ConcreteClassSchema.safeParse(concreteClass).success, [concreteClass]);
  const elementOk = useMemo(() => ConcreteElementSchema.safeParse(element).success, [element]);
  const workabilityOk = useMemo(() => WorkabilitySchema.safeParse(workability).success, [workability]);
  const destinationOk = useMemo(() => ConcreteDestinationSchema.safeParse(destination).success, [destination]);
  const dmaxOk = useMemo(() => MaxAggregateSchema.safeParse(maxAggregateMm).success, [maxAggregateMm]);

  const advisory =
    "Les dosages proposés sont indicatifs et doivent être validés par des essais de laboratoire, des essais de convenance et les normes applicables avant toute utilisation sur ouvrage.";

  function buildParsedInput() {
    const numeric = {
      volumeM3: toNumber(volumeM3),
      slumpCm: toNumber(slumpCm),
      cementDensityKgM3: toNumber(cementDensityKgM3),
      sandDensityKgM3: toNumber(sandDensityKgM3),
      gravelDensityKgM3: toNumber(gravelDensityKgM3),
      cementPrice: toNumber(cementPrice),
      sandPrice: toNumber(sandPrice),
      gravelPrice: toNumber(gravelPrice),
      admixturePrice: toNumber(admixturePrice),
      waterCementRatio: toNumber(waterCementRatio),
      waterLPerM3: toNumber(waterLPerM3),
      sandMoisturePct: toNumber(sandMoisturePct),
      gravelMoisturePct: toNumber(gravelMoisturePct),
      sandAbsorptionPct: toNumber(sandAbsorptionPct),
      gravelAbsorptionPct: toNumber(gravelAbsorptionPct),
      admixturePctOfCement: toNumber(admixturePctOfCement),
      admixtureLPerM3: toNumber(admixtureLPerM3),
    };

    const parsed = ConcreteMixInputSchema.safeParse({
      projectName: projectName.trim() ? projectName.trim() : undefined,
      element,
      volumeM3: numeric.volumeM3 ?? NaN,

      concreteClass,
      workability,
      slumpCm: workability === "slump_cm" ? numeric.slumpCm ?? NaN : undefined,
      destination,
      maxAggregateMm,

      cementType: cementType.trim() ? cementType.trim() : "Autre",
      cementDensityKgM3: numeric.cementDensityKgM3 ?? NaN,
      sandDensityKgM3: numeric.sandDensityKgM3 ?? NaN,
      gravelDensityKgM3: numeric.gravelDensityKgM3 ?? NaN,

      cementPrice: numeric.cementPrice ?? undefined,
      sandPrice: numeric.sandPrice ?? undefined,
      gravelPrice: numeric.gravelPrice ?? undefined,
      admixturePrice: numeric.admixturePrice ?? undefined,

      waterCementRatio: numeric.waterCementRatio ?? undefined,
      waterLPerM3: numeric.waterLPerM3 ?? undefined,

      sandMoisturePct: numeric.sandMoisturePct ?? NaN,
      gravelMoisturePct: numeric.gravelMoisturePct ?? NaN,
      sandAbsorptionPct: numeric.sandAbsorptionPct ?? NaN,
      gravelAbsorptionPct: numeric.gravelAbsorptionPct ?? NaN,

      admixtureEnabled,
      admixtureMode,
      admixturePctOfCement: admixtureMode === "pct_cement" ? numeric.admixturePctOfCement ?? undefined : undefined,
      admixtureLPerM3: admixtureMode === "l_per_m3" ? numeric.admixtureLPerM3 ?? undefined : undefined,
    });

    return parsed.success ? parsed.data : null;
  }

  function handleCompute() {
    setError(null);

    if (!classOk || !elementOk || !workabilityOk || !destinationOk || !dmaxOk) {
      setOutput(null);
      setError("Vérifie les champs de sélection.");
      return;
    }

    const parsed = buildParsedInput();
    if (!parsed) {
      setOutput(null);
      setError("Vérifie les champs numériques (volume, densités, humidité…).");
      return;
    }

    try {
      const res = calculateConcreteMix(parsed);
      setOutput(res);
    } catch {
      setOutput(null);
      setError("Calcul impossible avec ces valeurs.");
    }
  }

  const ecHint = classOk ? CLASS_HINT[concreteClass]?.ec : undefined;

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Projet</CardTitle>
          <CardDescription>Contexte du coulage et volume à produire.</CardDescription>
        </CardHeader>
        <div className="grid gap-4 px-6 pb-6">
          <Input label="Nom du chantier (optionnel)" value={projectName} onChange={(e) => setProjectName(e.target.value)} />

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-[var(--app-text)]">Élément à couler</label>
            <select
              className="w-full rounded-xl border border-[var(--app-card-border)] bg-[var(--app-input-bg)] px-3 py-2 text-sm text-[var(--app-text)]"
              value={element}
              onChange={(e) => setElement(e.target.value)}
            >
              {Object.keys(ELEMENT_LABEL).map((k) => (
                <option key={k} value={k}>
                  {ELEMENT_LABEL[k]}
                </option>
              ))}
            </select>
          </div>

          <Input label="Volume à produire (m³)" value={volumeM3} onChange={(e) => setVolumeM3(e.target.value)} />
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Béton visé</CardTitle>
          <CardDescription>Classe, ouvrabilité, destination et granulométrie.</CardDescription>
        </CardHeader>
        <div className="grid gap-4 px-6 pb-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-[var(--app-text)]">Classe</label>
              <select
                className="w-full rounded-xl border border-[var(--app-card-border)] bg-[var(--app-input-bg)] px-3 py-2 text-sm text-[var(--app-text)]"
                value={concreteClass}
                onChange={(e) => setConcreteClass(e.target.value)}
              >
                {ConcreteClassSchema.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <div className="text-xs text-[var(--app-text-muted)]">Repère E/C indicatif : {ecHint ?? "—"}</div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-[var(--app-text)]">Ouvrabilité</label>
              <select
                className="w-full rounded-xl border border-[var(--app-card-border)] bg-[var(--app-input-bg)] px-3 py-2 text-sm text-[var(--app-text)]"
                value={workability}
                onChange={(e) => setWorkability(e.target.value)}
              >
                {WorkabilitySchema.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {WORKABILITY_LABEL[opt] ?? opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {workability === "slump_cm" ? (
            <Input label="Affaissement (cm)" value={slumpCm} onChange={(e) => setSlumpCm(e.target.value)} />
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-[var(--app-text)]">Destination</label>
              <select
                className="w-full rounded-xl border border-[var(--app-card-border)] bg-[var(--app-input-bg)] px-3 py-2 text-sm text-[var(--app-text)]"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              >
                {ConcreteDestinationSchema.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {DESTINATION_LABEL[opt] ?? opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-[var(--app-text)]">Granulométrie max (mm)</label>
              <select
                className="w-full rounded-xl border border-[var(--app-card-border)] bg-[var(--app-input-bg)] px-3 py-2 text-sm text-[var(--app-text)]"
                value={maxAggregateMm}
                onChange={(e) => setMaxAggregateMm(e.target.value)}
              >
                {MaxAggregateSchema.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            {advisory}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Constituants</CardTitle>
          <CardDescription>Densités, prix optionnels.</CardDescription>
        </CardHeader>
        <div className="grid gap-4 px-6 pb-6">
          <Input label="Type de ciment (CEM I/II/III ou libre)" value={cementType} onChange={(e) => setCementType(e.target.value)} />

          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Masse volumique ciment (kg/m³)" value={cementDensityKgM3} onChange={(e) => setCementDensityKgM3(e.target.value)} />
            <Input label="Masse volumique sable (kg/m³)" value={sandDensityKgM3} onChange={(e) => setSandDensityKgM3(e.target.value)} />
            <Input label="Masse volumique gravier (kg/m³)" value={gravelDensityKgM3} onChange={(e) => setGravelDensityKgM3(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Prix ciment (optionnel)" hint="Prix par kg (si renseigné)." value={cementPrice} onChange={(e) => setCementPrice(e.target.value)} />
            <Input label="Prix sable (optionnel)" hint="Prix par kg (si renseigné)." value={sandPrice} onChange={(e) => setSandPrice(e.target.value)} />
            <Input label="Prix gravier (optionnel)" hint="Prix par kg (si renseigné)." value={gravelPrice} onChange={(e) => setGravelPrice(e.target.value)} />
            <Input label="Prix adjuvant (optionnel)" hint="Prix par L ou kg selon dosage." value={admixturePrice} onChange={(e) => setAdmixturePrice(e.target.value)} />
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Eau / corrections humidité</CardTitle>
          <CardDescription>Repères indicatifs + correction simple humidité/absorption.</CardDescription>
        </CardHeader>
        <div className="grid gap-4 px-6 pb-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Rapport E/C indicatif (optionnel)" hint="Laisse vide pour utiliser un repère automatique selon la classe." value={waterCementRatio} onChange={(e) => setWaterCementRatio(e.target.value)} />
            <Input label="Eau de gâchage (L/m³) (optionnel)" hint="Laisse vide pour un repère automatique selon l’ouvrabilité." value={waterLPerM3} onChange={(e) => setWaterLPerM3(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Humidité sable (%)" value={sandMoisturePct} onChange={(e) => setSandMoisturePct(e.target.value)} />
            <Input label="Humidité gravier (%)" value={gravelMoisturePct} onChange={(e) => setGravelMoisturePct(e.target.value)} />
            <Input label="Absorption sable (%)" value={sandAbsorptionPct} onChange={(e) => setSandAbsorptionPct(e.target.value)} />
            <Input label="Absorption gravier (%)" value={gravelAbsorptionPct} onChange={(e) => setGravelAbsorptionPct(e.target.value)} />
          </div>

          <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-bold text-[var(--app-text)]">Adjuvant</div>
              <label className="inline-flex items-center gap-2 text-sm text-[var(--app-text-muted)]">
                <input type="checkbox" checked={admixtureEnabled} onChange={(e) => setAdmixtureEnabled(e.target.checked)} />
                Activer
              </label>
            </div>

            {admixtureEnabled ? (
              <div className="mt-3 grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-[var(--app-text)]">Mode dosage</label>
                  <select
                    className="w-full rounded-xl border border-[var(--app-card-border)] bg-[var(--app-input-bg)] px-3 py-2 text-sm text-[var(--app-text)]"
                    value={admixtureMode}
                    onChange={(e) => setAdmixtureMode(e.target.value as "pct_cement" | "l_per_m3")}
                  >
                    <option value="pct_cement">% du ciment</option>
                    <option value="l_per_m3">L/m³</option>
                  </select>
                </div>

                {admixtureMode === "pct_cement" ? (
                  <Input label="Dosage adjuvant (% du ciment)" value={admixturePctOfCement} onChange={(e) => setAdmixturePctOfCement(e.target.value)} />
                ) : (
                  <Input label="Dosage adjuvant (L/m³)" value={admixtureLPerM3} onChange={(e) => setAdmixtureLPerM3(e.target.value)} />
                )}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button type="button" variant="secondary" size="lg" onClick={handleCompute}>
              Calculer
            </Button>
          </div>

          {error ? (
            <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
              {error}
            </div>
          ) : null}
        </div>
      </Card>

      {output ? (
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Résultats (pour 1 m³)</CardTitle>
              <CardDescription>Valeurs indicatives, à valider avant usage sur ouvrage.</CardDescription>
            </CardHeader>
            <div className="grid gap-2 px-6 pb-6 text-sm text-[var(--app-text-muted)]">
              <div className="flex items-center justify-between gap-3"><span>Ciment</span><span className="font-semibold text-[var(--app-text)]">{output.perM3.cementKg} kg/m³</span></div>
              <div className="flex items-center justify-between gap-3"><span>Sacs 50 kg</span><span className="font-semibold text-[var(--app-text)]">{output.perM3.cementBags50Kg}</span></div>
              <div className="flex items-center justify-between gap-3"><span>Eau théorique</span><span className="font-semibold text-[var(--app-text)]">{output.perM3.waterTheoreticalL} L/m³</span></div>
              <div className="flex items-center justify-between gap-3"><span>Eau corrigée</span><span className="font-semibold text-[var(--app-text)]">{output.perM3.waterCorrectedL} L/m³</span></div>
              <div className="flex items-center justify-between gap-3"><span>Sable</span><span className="font-semibold text-[var(--app-text)]">{output.perM3.sandKg} kg/m³</span></div>
              <div className="flex items-center justify-between gap-3"><span>Sable (≈)</span><span className="font-semibold text-[var(--app-text)]">{output.perM3.sandM3Approx} m³</span></div>
              <div className="flex items-center justify-between gap-3"><span>Gravier</span><span className="font-semibold text-[var(--app-text)]">{output.perM3.gravelKg} kg/m³</span></div>
              <div className="flex items-center justify-between gap-3"><span>Gravier (≈)</span><span className="font-semibold text-[var(--app-text)]">{output.perM3.gravelM3Approx} m³</span></div>
              <div className="flex items-center justify-between gap-3"><span>Adjuvant</span><span className="font-semibold text-[var(--app-text)]">{output.perM3.admixtureAmount} {output.perM3.admixtureUnit}/m³</span></div>
              <div className="flex items-center justify-between gap-3"><span>Rapport E/C</span><span className="font-semibold text-[var(--app-text)]">{output.perM3.waterCementRatio}</span></div>
              <div className="flex items-center justify-between gap-3"><span>Coût estimatif</span><span className="font-semibold text-[var(--app-text)]">{output.perM3.estimatedCost} FCFA (si prix renseignés)</span></div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Totaux (pour {volumeM3} m³)</CardTitle>
              <CardDescription>Totaux calculés à partir des valeurs par m³.</CardDescription>
            </CardHeader>
            <div className="grid gap-2 px-6 pb-6 text-sm text-[var(--app-text-muted)]">
              <div className="flex items-center justify-between gap-3"><span>Ciment total</span><span className="font-semibold text-[var(--app-text)]">{output.totals.cementKgTotal} kg</span></div>
              <div className="flex items-center justify-between gap-3"><span>Sacs 50 kg</span><span className="font-semibold text-[var(--app-text)]">{output.totals.cementBags50KgTotal}</span></div>
              <div className="flex items-center justify-between gap-3"><span>Eau totale</span><span className="font-semibold text-[var(--app-text)]">{output.totals.waterLTotal} L</span></div>
              <div className="flex items-center justify-between gap-3"><span>Sable total</span><span className="font-semibold text-[var(--app-text)]">{output.totals.sandKgTotal} kg</span></div>
              <div className="flex items-center justify-between gap-3"><span>Gravier total</span><span className="font-semibold text-[var(--app-text)]">{output.totals.gravelKgTotal} kg</span></div>
              <div className="flex items-center justify-between gap-3"><span>Adjuvant total</span><span className="font-semibold text-[var(--app-text)]">{output.totals.admixtureTotal}</span></div>
              <div className="flex items-center justify-between gap-3"><span>Coût total</span><span className="font-semibold text-[var(--app-text)]">{output.totals.estimatedCostTotal} FCFA</span></div>
            </div>
          </Card>

          <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            {advisory}
          </div>
        </div>
      ) : null}
    </div>
  );
}
