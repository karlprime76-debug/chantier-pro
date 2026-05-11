import type { ConcreteCalculation, SteelCalculation, StraightStairCalculation } from "@prisma/client";

export type CalculationKind = "concrete" | "steel" | "stair_straight";

export type CalculationHistoryItem = {
  kind: CalculationKind;
  id: string;
  createdAt: Date;
  projectId: string;
  title: string;
  summary: string;
  reopenHref: string;
};

function fmt(n: unknown, suffix: string) {
  if (n === null || n === undefined) return "—";
  return `${String(n)} ${suffix}`.trim();
}

export function mapConcreteToHistory(c: ConcreteCalculation): CalculationHistoryItem {
  const element = c.elementType || "Béton";
  const title = `Béton — ${element}`;
  const summary = `Volume+perte: ${fmt(c.volumeWithWaste, "m³")} · Ciment: ${fmt(c.cementEstimateKg, "kg")}`;
  return {
    kind: "concrete",
    id: c.id,
    createdAt: c.createdAt,
    projectId: c.projectId,
    title,
    summary,
    reopenHref: `/dashboard/calculators/concrete?projectId=${encodeURIComponent(c.projectId)}`,
  };
}

export function mapSteelToHistory(c: SteelCalculation): CalculationHistoryItem {
  const title = `Acier — Ø${c.diameterMm}`;
  const summary = `Longueur: ${fmt(c.totalLengthM, "m")} · Poids: ${fmt(c.totalWeightKg, "kg")}`;
  return {
    kind: "steel",
    id: c.id,
    createdAt: c.createdAt,
    projectId: c.projectId,
    title,
    summary,
    reopenHref: `/dashboard/calculators/steel?projectId=${encodeURIComponent(c.projectId)}`,
  };
}

export function mapStraightStairToHistory(c: StraightStairCalculation): CalculationHistoryItem {
  const title = "Escalier droit";
  const summary = `Marches: ${c.stepsCount} · Béton+perte: ${fmt(c.concreteVolumeWithLossM3, "m³")}`;
  return {
    kind: "stair_straight",
    id: c.id,
    createdAt: c.createdAt,
    projectId: c.projectId,
    title,
    summary,
    reopenHref: `/dashboard/calculators/stairs/straight?projectId=${encodeURIComponent(c.projectId)}`,
  };
}
