"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

import {
  calculateGateFoundation,
  calculateGroundBeam,
  calculateIsolatedFooting,
  calculatePileFoundation,
  calculateRaft,
  calculateStripFooting,
  calculateWellFoundation,
  type FoundationsOutput,
} from "@/lib/calculators/foundations";

type FoundationKind =
  | "ISOLATED_FOOTING"
  | "STRIP_FOOTING"
  | "GROUND_BEAM"
  | "RAFT"
  | "WELL"
  | "PILE"
  | "GATE";

function toNumber(value: string | number | null): number | null {
  if (value === null) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;

  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 3 }).format(n);
}

function fmtMoney(n?: number): string {
  if (typeof n !== "number" || !Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("fr-FR").format(Math.round(n));
}

function clampPositiveOrNull(n: number | null, allowZero = false): number | null {
  if (n === null) return null;
  if (!Number.isFinite(n)) return null;
  if (allowZero && n === 0) return 0;
  return n > 0 ? n : null;
}

const KIND_LABEL: Record<FoundationKind, string> = {
  ISOLATED_FOOTING: "Semelle isolée",
  STRIP_FOOTING: "Semelle filante",
  GROUND_BEAM: "Longrine",
  RAFT: "Radier",
  WELL: "Puits",
  PILE: "Pieux",
  GATE: "Clôture / portail",
};

export function FoundationsCalculator() {
  const [kind, setKind] = useState<FoundationKind>("ISOLATED_FOOTING");

  const [priceConcretePerM3, setPriceConcretePerM3] = useState("");
  const [priceSteelPerKg, setPriceSteelPerKg] = useState("");
  const [steelRatioKgPerM3, setSteelRatioKgPerM3] = useState("85");

  // A. Semelle isolée
  const [isoLengthM, setIsoLengthM] = useState("1.2");
  const [isoWidthM, setIsoWidthM] = useState("1.2");
  const [isoHeightM, setIsoHeightM] = useState("0.35");
  const [isoQty, setIsoQty] = useState("4");
  const [isoBlindingThkM, setIsoBlindingThkM] = useState("0.05");
  const [isoBlindingOverhangM, setIsoBlindingOverhangM] = useState("0.1");

  // B. Semelle filante
  const [stripLengthM, setStripLengthM] = useState("18");
  const [stripWidthM, setStripWidthM] = useState("0.5");
  const [stripHeightM, setStripHeightM] = useState("0.35");
  const [stripBlindingThkM, setStripBlindingThkM] = useState("0.05");
  const [stripBlindingWidthM, setStripBlindingWidthM] = useState("0.6");
  const [stripTrenchWidthM, setStripTrenchWidthM] = useState("0.7");
  const [stripTrenchDepthM, setStripTrenchDepthM] = useState("0.6");

  // C. Longrine
  const [beamLengthM, setBeamLengthM] = useState("12");
  const [beamWidthM, setBeamWidthM] = useState("0.25");
  const [beamHeightM, setBeamHeightM] = useState("0.45");
  const [beamFormwork, setBeamFormwork] = useState(true);

  // D. Radier
  const [raftLengthM, setRaftLengthM] = useState("8");
  const [raftWidthM, setRaftWidthM] = useState("6");
  const [raftThkM, setRaftThkM] = useState("0.18");
  const [raftBlindingThkM, setRaftBlindingThkM] = useState("0.05");

  // E. Puits
  const [wellShape, setWellShape] = useState<"CIRCULAR" | "RECTANGULAR">("CIRCULAR");
  const [wellDiameterM, setWellDiameterM] = useState("1.2");
  const [wellRectLengthM, setWellRectLengthM] = useState("1.2");
  const [wellRectWidthM, setWellRectWidthM] = useState("1.0");
  const [wellDepthM, setWellDepthM] = useState("2.0");
  const [wellQty, setWellQty] = useState("2");
  const [wellConcreteHeightM, setWellConcreteHeightM] = useState("1.8");

  // F. Pieux
  const [pileDiameterM, setPileDiameterM] = useState("0.35");
  const [pileDepthM, setPileDepthM] = useState("6");
  const [pileQty, setPileQty] = useState("6");

  // G. Clôture / portail
  const [gatePostCount, setGatePostCount] = useState("12");
  const [gateBlockLengthM, setGateBlockLengthM] = useState("0.4");
  const [gateBlockWidthM, setGateBlockWidthM] = useState("0.4");
  const [gateBlockHeightM, setGateBlockHeightM] = useState("0.8");
  const [gateStripLengthM, setGateStripLengthM] = useState("0");
  const [gateStripWidthM, setGateStripWidthM] = useState("0.25");
  const [gateStripHeightM, setGateStripHeightM] = useState("0.3");

  const [output, setOutput] = useState<FoundationsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const numericPricing = useMemo(() => {
    return {
      priceConcretePerM3: clampPositiveOrNull(toNumber(priceConcretePerM3), true) ?? undefined,
      priceSteelPerKg: clampPositiveOrNull(toNumber(priceSteelPerKg), true) ?? undefined,
      steelRatioKgPerM3: clampPositiveOrNull(toNumber(steelRatioKgPerM3), true) ?? undefined,
    };
  }, [priceConcretePerM3, priceSteelPerKg, steelRatioKgPerM3]);

  function handleCompute() {
    setError(null);
    setOutput(null);

    try {
      if (kind === "ISOLATED_FOOTING") {
        const lengthM = clampPositiveOrNull(toNumber(isoLengthM));
        const widthM = clampPositiveOrNull(toNumber(isoWidthM));
        const heightM = clampPositiveOrNull(toNumber(isoHeightM));
        const quantity = clampPositiveOrNull(toNumber(isoQty));
        const blindingThicknessM = clampPositiveOrNull(toNumber(isoBlindingThkM), true);
        const blindingOverhangM = clampPositiveOrNull(toNumber(isoBlindingOverhangM), true);
        if (
          lengthM === null ||
          widthM === null ||
          heightM === null ||
          quantity === null ||
          blindingThicknessM === null ||
          blindingOverhangM === null
        ) {
          setError("Vérifie les champs numériques.");
          return;
        }

        setOutput(
          calculateIsolatedFooting({
            lengthM,
            widthM,
            heightM,
            quantity,
            blindingThicknessM,
            blindingOverhangM,
            steelRatioKgPerM3: numericPricing.steelRatioKgPerM3,
            priceConcretePerM3: numericPricing.priceConcretePerM3,
            priceSteelPerKg: numericPricing.priceSteelPerKg,
          }),
        );
        return;
      }

      if (kind === "STRIP_FOOTING") {
        const totalLengthM = clampPositiveOrNull(toNumber(stripLengthM));
        const widthM = clampPositiveOrNull(toNumber(stripWidthM));
        const heightM = clampPositiveOrNull(toNumber(stripHeightM));
        const blindingThicknessM = clampPositiveOrNull(toNumber(stripBlindingThkM), true);
        const blindingWidthM = clampPositiveOrNull(toNumber(stripBlindingWidthM));
        const trenchWidthM = clampPositiveOrNull(toNumber(stripTrenchWidthM));
        const trenchDepthM = clampPositiveOrNull(toNumber(stripTrenchDepthM));

        if (
          totalLengthM === null ||
          widthM === null ||
          heightM === null ||
          blindingThicknessM === null ||
          blindingWidthM === null ||
          trenchWidthM === null ||
          trenchDepthM === null
        ) {
          setError("Vérifie les champs numériques.");
          return;
        }

        setOutput(
          calculateStripFooting({
            totalLengthM,
            widthM,
            heightM,
            blindingThicknessM,
            blindingWidthM,
            trenchWidthM,
            trenchDepthM,
            steelRatioKgPerM3: numericPricing.steelRatioKgPerM3,
            priceConcretePerM3: numericPricing.priceConcretePerM3,
            priceSteelPerKg: numericPricing.priceSteelPerKg,
          }),
        );
        return;
      }

      if (kind === "GROUND_BEAM") {
        const totalLengthM = clampPositiveOrNull(toNumber(beamLengthM));
        const widthM = clampPositiveOrNull(toNumber(beamWidthM));
        const heightM = clampPositiveOrNull(toNumber(beamHeightM));

        if (totalLengthM === null || widthM === null || heightM === null) {
          setError("Vérifie les champs numériques.");
          return;
        }

        setOutput(
          calculateGroundBeam({
            totalLengthM,
            widthM,
            heightM,
            formworkEnabled: beamFormwork,
            steelRatioKgPerM3: numericPricing.steelRatioKgPerM3,
            priceConcretePerM3: numericPricing.priceConcretePerM3,
            priceSteelPerKg: numericPricing.priceSteelPerKg,
          }),
        );
        return;
      }

      if (kind === "RAFT") {
        const lengthM = clampPositiveOrNull(toNumber(raftLengthM));
        const widthM = clampPositiveOrNull(toNumber(raftWidthM));
        const thicknessM = clampPositiveOrNull(toNumber(raftThkM));
        const blindingThicknessM = clampPositiveOrNull(toNumber(raftBlindingThkM), true);

        if (lengthM === null || widthM === null || thicknessM === null || blindingThicknessM === null) {
          setError("Vérifie les champs numériques.");
          return;
        }

        setOutput(
          calculateRaft({
            lengthM,
            widthM,
            thicknessM,
            blindingThicknessM,
            steelRatioKgPerM3: numericPricing.steelRatioKgPerM3,
            priceConcretePerM3: numericPricing.priceConcretePerM3,
            priceSteelPerKg: numericPricing.priceSteelPerKg,
          }),
        );
        return;
      }

      if (kind === "WELL") {
        const quantity = clampPositiveOrNull(toNumber(wellQty));
        const depthM = clampPositiveOrNull(toNumber(wellDepthM));
        const concreteHeightM = clampPositiveOrNull(toNumber(wellConcreteHeightM));
        if (quantity === null || depthM === null || concreteHeightM === null) {
          setError("Vérifie les champs numériques.");
          return;
        }

        if (wellShape === "CIRCULAR") {
          const diameterM = clampPositiveOrNull(toNumber(wellDiameterM));
          if (diameterM === null) {
            setError("Vérifie le diamètre du puits.");
            return;
          }

          setOutput(
            calculateWellFoundation({
              shape: "CIRCULAR",
              diameterM,
              depthM,
              quantity,
              concreteHeightM,
              steelRatioKgPerM3: numericPricing.steelRatioKgPerM3,
              priceConcretePerM3: numericPricing.priceConcretePerM3,
              priceSteelPerKg: numericPricing.priceSteelPerKg,
            }),
          );
          return;
        }

        const lengthM = clampPositiveOrNull(toNumber(wellRectLengthM));
        const widthM = clampPositiveOrNull(toNumber(wellRectWidthM));
        if (lengthM === null || widthM === null) {
          setError("Vérifie les dimensions du puits rectangulaire.");
          return;
        }

        setOutput(
          calculateWellFoundation({
            shape: "RECTANGULAR",
            lengthM,
            widthM,
            depthM,
            quantity,
            concreteHeightM,
            steelRatioKgPerM3: numericPricing.steelRatioKgPerM3,
            priceConcretePerM3: numericPricing.priceConcretePerM3,
            priceSteelPerKg: numericPricing.priceSteelPerKg,
          }),
        );
        return;
      }

      if (kind === "PILE") {
        const diameterM = clampPositiveOrNull(toNumber(pileDiameterM));
        const depthM = clampPositiveOrNull(toNumber(pileDepthM));
        const quantity = clampPositiveOrNull(toNumber(pileQty));
        if (diameterM === null || depthM === null || quantity === null) {
          setError("Vérifie les champs numériques.");
          return;
        }

        setOutput(
          calculatePileFoundation({
            diameterM,
            depthM,
            quantity,
            steelRatioKgPerM3: numericPricing.steelRatioKgPerM3,
            priceConcretePerM3: numericPricing.priceConcretePerM3,
            priceSteelPerKg: numericPricing.priceSteelPerKg,
          }),
        );
        return;
      }

      const postCount = clampPositiveOrNull(toNumber(gatePostCount));
      const blockLengthM = clampPositiveOrNull(toNumber(gateBlockLengthM));
      const blockWidthM = clampPositiveOrNull(toNumber(gateBlockWidthM));
      const blockHeightM = clampPositiveOrNull(toNumber(gateBlockHeightM));
      const gateStripLengthValueM = clampPositiveOrNull(toNumber(gateStripLengthM), true);
      const gateStripWidthValueM = clampPositiveOrNull(toNumber(gateStripWidthM), true);
      const gateStripHeightValueM = clampPositiveOrNull(toNumber(gateStripHeightM), true);

      if (
        postCount === null ||
        blockLengthM === null ||
        blockWidthM === null ||
        blockHeightM === null ||
        gateStripLengthValueM === null ||
        gateStripWidthValueM === null ||
        gateStripHeightValueM === null
      ) {
        setError("Vérifie les champs numériques.");
        return;
      }

      setOutput(
        calculateGateFoundation({
          postCount,
          blockLengthM,
          blockWidthM,
          blockHeightM,
          stripLengthM: gateStripLengthValueM,
          stripWidthM: gateStripWidthValueM,
          stripHeightM: gateStripHeightValueM,
          steelRatioKgPerM3: numericPricing.steelRatioKgPerM3,
          priceConcretePerM3: numericPricing.priceConcretePerM3,
          priceSteelPerKg: numericPricing.priceSteelPerKg,
        }),
      );
    } catch {
      setError("Calcul impossible avec ces valeurs.");
    }
  }

  const summary = useMemo(() => {
    if (!output) return null;
    return `Pour cette fondation, prévoyez environ ${fmt(output.foundationConcreteM3 + output.blindingConcreteM3)} m³ de béton, ${fmt(
      output.estimatedSteelKg,
    )} kg d’acier et ${fmt(output.excavationM3)} m³ de fouille.`;
  }, [output]);

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>Type de fondation</CardTitle>
              <CardDescription>Choisis le type, renseigne les dimensions, puis calcule les quantitatifs.</CardDescription>
            </div>
            <div className="rounded-full border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] px-3 py-2 text-xs font-bold text-[var(--app-text-muted)]">
              Entreprise
            </div>
          </div>
        </CardHeader>

        <div className="grid gap-4 px-6 pb-6">
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-[var(--app-text)]">Choix</label>
            <select
              className="w-full rounded-xl border border-[var(--app-card-border)] bg-[var(--app-input-bg)] px-3 py-2 text-sm text-[var(--app-text)]"
              value={kind}
              onChange={(e) => setKind(e.target.value as FoundationKind)}
            >
              {Object.keys(KIND_LABEL).map((k) => (
                <option key={k} value={k}>
                  {KIND_LABEL[k as FoundationKind]}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Ratio acier (kg/m³)"
              hint="Estimatif, dépend des plans et prescriptions."
              value={steelRatioKgPerM3}
              onChange={(e) => setSteelRatioKgPerM3(e.target.value)}
            />
            <Input
              label="Prix béton (FCFA/m³)"
              hint="Optionnel."
              value={priceConcretePerM3}
              onChange={(e) => setPriceConcretePerM3(e.target.value)}
            />
            <Input
              label="Prix acier (FCFA/kg)"
              hint="Optionnel."
              value={priceSteelPerKg}
              onChange={(e) => setPriceSteelPerKg(e.target.value)}
            />
          </div>

          {kind === "ISOLATED_FOOTING" ? (
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-4">
                <Input label="Longueur L (m)" value={isoLengthM} onChange={(e) => setIsoLengthM(e.target.value)} />
                <Input label="Largeur l (m)" value={isoWidthM} onChange={(e) => setIsoWidthM(e.target.value)} />
                <Input label="Hauteur h (m)" value={isoHeightM} onChange={(e) => setIsoHeightM(e.target.value)} />
                <Input label="Nombre" value={isoQty} onChange={(e) => setIsoQty(e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Épaisseur béton de propreté (m)"
                  value={isoBlindingThkM}
                  onChange={(e) => setIsoBlindingThkM(e.target.value)}
                />
                <Input
                  label="Débord propreté (m)"
                  hint="De chaque côté."
                  value={isoBlindingOverhangM}
                  onChange={(e) => setIsoBlindingOverhangM(e.target.value)}
                />
              </div>
            </div>
          ) : null}

          {kind === "STRIP_FOOTING" ? (
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <Input label="Longueur totale (m)" value={stripLengthM} onChange={(e) => setStripLengthM(e.target.value)} />
                <Input label="Largeur (m)" value={stripWidthM} onChange={(e) => setStripWidthM(e.target.value)} />
                <Input label="Hauteur (m)" value={stripHeightM} onChange={(e) => setStripHeightM(e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Épaisseur béton de propreté (m)"
                  value={stripBlindingThkM}
                  onChange={(e) => setStripBlindingThkM(e.target.value)}
                />
                <Input
                  label="Largeur béton de propreté (m)"
                  value={stripBlindingWidthM}
                  onChange={(e) => setStripBlindingWidthM(e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Largeur fouille (m)"
                  value={stripTrenchWidthM}
                  onChange={(e) => setStripTrenchWidthM(e.target.value)}
                />
                <Input
                  label="Profondeur fouille (m)"
                  value={stripTrenchDepthM}
                  onChange={(e) => setStripTrenchDepthM(e.target.value)}
                />
              </div>
            </div>
          ) : null}

          {kind === "GROUND_BEAM" ? (
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <Input label="Longueur totale (m)" value={beamLengthM} onChange={(e) => setBeamLengthM(e.target.value)} />
                <Input label="Largeur (m)" value={beamWidthM} onChange={(e) => setBeamWidthM(e.target.value)} />
                <Input label="Hauteur (m)" value={beamHeightM} onChange={(e) => setBeamHeightM(e.target.value)} />
              </div>
              <label className="flex items-center gap-2 text-sm text-[var(--app-text)]">
                <input
                  type="checkbox"
                  checked={beamFormwork}
                  onChange={(e) => setBeamFormwork(e.target.checked)}
                />
                Coffrage estimatif
              </label>
            </div>
          ) : null}

          {kind === "RAFT" ? (
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <Input label="Longueur (m)" value={raftLengthM} onChange={(e) => setRaftLengthM(e.target.value)} />
                <Input label="Largeur (m)" value={raftWidthM} onChange={(e) => setRaftWidthM(e.target.value)} />
                <Input label="Épaisseur (m)" value={raftThkM} onChange={(e) => setRaftThkM(e.target.value)} />
              </div>
              <Input
                label="Épaisseur béton de propreté (m)"
                value={raftBlindingThkM}
                onChange={(e) => setRaftBlindingThkM(e.target.value)}
              />
            </div>
          ) : null}

          {kind === "WELL" ? (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-[var(--app-text)]">Forme</label>
                <select
                  className="w-full rounded-xl border border-[var(--app-card-border)] bg-[var(--app-input-bg)] px-3 py-2 text-sm text-[var(--app-text)]"
                  value={wellShape}
                  onChange={(e) => setWellShape(e.target.value as "CIRCULAR" | "RECTANGULAR")}
                >
                  <option value="CIRCULAR">Circulaire</option>
                  <option value="RECTANGULAR">Rectangulaire</option>
                </select>
              </div>

              {wellShape === "CIRCULAR" ? (
                <Input label="Diamètre (m)" value={wellDiameterM} onChange={(e) => setWellDiameterM(e.target.value)} />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Longueur (m)"
                    value={wellRectLengthM}
                    onChange={(e) => setWellRectLengthM(e.target.value)}
                  />
                  <Input label="Largeur (m)" value={wellRectWidthM} onChange={(e) => setWellRectWidthM(e.target.value)} />
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-3">
                <Input label="Profondeur fouille (m)" value={wellDepthM} onChange={(e) => setWellDepthM(e.target.value)} />
                <Input label="Hauteur béton (m)" value={wellConcreteHeightM} onChange={(e) => setWellConcreteHeightM(e.target.value)} />
                <Input label="Nombre" value={wellQty} onChange={(e) => setWellQty(e.target.value)} />
              </div>
            </div>
          ) : null}

          {kind === "PILE" ? (
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <Input label="Diamètre (m)" value={pileDiameterM} onChange={(e) => setPileDiameterM(e.target.value)} />
                <Input label="Profondeur (m)" value={pileDepthM} onChange={(e) => setPileDepthM(e.target.value)} />
                <Input label="Nombre" value={pileQty} onChange={(e) => setPileQty(e.target.value)} />
              </div>
              <div className="text-xs text-[var(--app-text-muted)]">Volume d’un pieu: π × d² / 4 × profondeur.</div>
            </div>
          ) : null}

          {kind === "GATE" ? (
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-4">
                <Input label="Nombre de poteaux" value={gatePostCount} onChange={(e) => setGatePostCount(e.target.value)} />
                <Input label="Massif L (m)" value={gateBlockLengthM} onChange={(e) => setGateBlockLengthM(e.target.value)} />
                <Input label="Massif l (m)" value={gateBlockWidthM} onChange={(e) => setGateBlockWidthM(e.target.value)} />
                <Input label="Massif h (m)" value={gateBlockHeightM} onChange={(e) => setGateBlockHeightM(e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Input label="Longueur semelle (m)" value={gateStripLengthM} onChange={(e) => setGateStripLengthM(e.target.value)} />
                <Input label="Largeur semelle (m)" value={gateStripWidthM} onChange={(e) => setGateStripWidthM(e.target.value)} />
                <Input label="Hauteur semelle (m)" value={gateStripHeightM} onChange={(e) => setGateStripHeightM(e.target.value)} />
              </div>
              <div className="text-xs text-[var(--app-text-muted)]">Si pas de semelle filante, mets longueur semelle à 0.</div>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button type="button" variant="secondary" onClick={handleCompute}>
              Calculer
            </Button>
          </div>

          {error ? <div className="text-sm text-rose-200">{error}</div> : null}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Résultats</CardTitle>
          <CardDescription>Quantitatifs indicatifs (métré chantier). Évite les valeurs négatives et vérifie tes hypothèses.</CardDescription>
        </CardHeader>

        {output ? (
          <div className="grid gap-3 px-6 pb-6">
            {summary ? (
              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
                {summary}
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                <div className="text-xs font-bold text-[var(--app-text-muted)]">Volume fouille</div>
                <div className="mt-2 text-lg font-extrabold text-[var(--app-text)]">{fmt(output.excavationM3)} m³</div>
              </div>
              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                <div className="text-xs font-bold text-[var(--app-text-muted)]">Béton de propreté</div>
                <div className="mt-2 text-lg font-extrabold text-[var(--app-text)]">{fmt(output.blindingConcreteM3)} m³</div>
              </div>
              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                <div className="text-xs font-bold text-[var(--app-text-muted)]">Béton fondation</div>
                <div className="mt-2 text-lg font-extrabold text-[var(--app-text)]">{fmt(output.foundationConcreteM3)} m³</div>
              </div>
              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                <div className="text-xs font-bold text-[var(--app-text-muted)]">Acier estimé</div>
                <div className="mt-2 text-lg font-extrabold text-[var(--app-text)]">{fmt(output.estimatedSteelKg)} kg</div>
              </div>
              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                <div className="text-xs font-bold text-[var(--app-text-muted)]">Coffrage estimé</div>
                <div className="mt-2 text-lg font-extrabold text-[var(--app-text)]">{fmt(output.estimatedFormworkM2)} m²</div>
              </div>
              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                <div className="text-xs font-bold text-[var(--app-text-muted)]">Remblai estimé</div>
                <div className="mt-2 text-lg font-extrabold text-[var(--app-text)]">{fmt(output.estimatedBackfillM3)} m³</div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                <div className="text-xs font-bold text-[var(--app-text-muted)]">Coût béton</div>
                <div className="mt-2 text-lg font-extrabold text-[var(--app-text)]">{fmtMoney(output.estimatedConcreteCostCfa)} FCFA</div>
              </div>
              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                <div className="text-xs font-bold text-[var(--app-text-muted)]">Coût acier</div>
                <div className="mt-2 text-lg font-extrabold text-[var(--app-text)]">{fmtMoney(output.estimatedSteelCostCfa)} FCFA</div>
              </div>
              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                <div className="text-xs font-bold text-[var(--app-text-muted)]">Total estimatif</div>
                <div className="mt-2 text-lg font-extrabold text-[var(--app-text)]">{fmtMoney(output.estimatedTotalCostCfa)} FCFA</div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
              Les résultats sont fournis à titre d’aide au métré et au suivi chantier. Les dimensions, sections d’acier et dispositions
              finales doivent respecter les plans d’exécution, les études de sol et les notes de calcul validées.
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
    </div>
  );
}
