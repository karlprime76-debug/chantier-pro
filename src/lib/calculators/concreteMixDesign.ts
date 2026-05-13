import { z } from "zod";

export const ConcreteClassSchema = z.enum(["C12/15", "C16/20", "C20/25", "C25/30", "C30/37"]);
export type ConcreteClass = z.infer<typeof ConcreteClassSchema>;

export const WorkabilitySchema = z.enum(["ferme", "plastique", "fluide", "slump_cm"]);
export type Workability = z.infer<typeof WorkabilitySchema>;

export const ConcreteDestinationSchema = z.enum([
  "beton_de_proprete",
  "beton_arme",
  "dallage",
  "fondation",
  "structure_courante",
]);
export type ConcreteDestination = z.infer<typeof ConcreteDestinationSchema>;

export const CementTypeSchema = z.enum(["CEM I", "CEM II", "CEM III", "Autre"]);
export type CementType = z.infer<typeof CementTypeSchema>;

export const MaxAggregateSchema = z.enum(["10", "15", "20", "25"]);
export type MaxAggregateMm = z.infer<typeof MaxAggregateSchema>;

export const ConcreteElementSchema = z.enum([
  "dalle",
  "poteau",
  "poutre",
  "longrine",
  "semelle",
  "radier",
  "beton_de_proprete",
  "autre",
]);
export type ConcreteElement = z.infer<typeof ConcreteElementSchema>;

export const ConcreteMixInputSchema = z.object({
  projectName: z.string().trim().max(120).optional(),
  element: ConcreteElementSchema,
  volumeM3: z.number().positive(),

  concreteClass: ConcreteClassSchema,
  workability: WorkabilitySchema,
  slumpCm: z.number().min(0).max(30).optional(),
  destination: ConcreteDestinationSchema,
  maxAggregateMm: MaxAggregateSchema,

  cementType: CementTypeSchema.or(z.string().trim().min(1).max(40)),
  cementDensityKgM3: z.number().positive().default(3150),
  sandDensityKgM3: z.number().positive().default(1600),
  gravelDensityKgM3: z.number().positive().default(1500),

  cementPrice: z.number().min(0).optional(),
  sandPrice: z.number().min(0).optional(),
  gravelPrice: z.number().min(0).optional(),
  admixturePrice: z.number().min(0).optional(),

  waterCementRatio: z.number().positive().optional(),
  waterLPerM3: z.number().positive().optional(),

  sandMoisturePct: z.number().min(0).max(30).default(0),
  gravelMoisturePct: z.number().min(0).max(30).default(0),
  sandAbsorptionPct: z.number().min(0).max(15).default(0),
  gravelAbsorptionPct: z.number().min(0).max(15).default(0),

  admixtureEnabled: z.boolean().default(false),
  admixtureMode: z.enum(["pct_cement", "l_per_m3"]).default("pct_cement"),
  admixturePctOfCement: z.number().min(0).max(10).optional(),
  admixtureLPerM3: z.number().min(0).max(50).optional(),
});

export type ConcreteMixInput = z.infer<typeof ConcreteMixInputSchema>;

export type ConcreteMixPerM3 = {
  cementKg: number;
  cementBags50Kg: number;
  waterTheoreticalL: number;
  waterCorrectedL: number;
  sandKg: number;
  sandM3Approx: number;
  gravelKg: number;
  gravelM3Approx: number;
  admixtureAmount: number;
  admixtureUnit: "L" | "kg";
  waterCementRatio: number;
  estimatedCost: number;
};

export type ConcreteMixTotals = {
  cementKgTotal: number;
  cementBags50KgTotal: number;
  waterLTotal: number;
  sandKgTotal: number;
  gravelKgTotal: number;
  admixtureTotal: number;
  estimatedCostTotal: number;
};

export type ConcreteMixOutput = {
  perM3: ConcreteMixPerM3;
  totals: ConcreteMixTotals;
};

function clampMin(value: number, min: number) {
  return value < min ? min : value;
}

function round(value: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function calculateConcreteMix(input: ConcreteMixInput): ConcreteMixOutput {
  const ecDefault: Record<ConcreteClass, number> = {
    "C12/15": 0.6,
    "C16/20": 0.55,
    "C20/25": 0.5,
    "C25/30": 0.45,
    "C30/37": 0.4,
  };

  const waterDefaultByWorkability: Record<Exclude<Workability, "slump_cm">, number> = {
    ferme: 160,
    plastique: 180,
    fluide: 200,
  };

  const waterLPerM3 =
    input.waterLPerM3 ??
    (input.workability === "slump_cm"
      ? input.slumpCm === undefined
        ? 180
        : input.slumpCm <= 6
          ? 160
          : input.slumpCm <= 10
            ? 180
            : 200
      : waterDefaultByWorkability[input.workability]);

  const waterCementRatio = input.waterCementRatio ?? ecDefault[input.concreteClass];

  const cementKg = clampMin(waterLPerM3 / waterCementRatio, 0);

  const totalAggregatesKg = 1800;

  const sandRatioByDmax: Record<MaxAggregateMm, number> = {
    "10": 0.45,
    "15": 0.4,
    "20": 0.38,
    "25": 0.35,
  };

  const sandKg = clampMin(totalAggregatesKg * sandRatioByDmax[input.maxAggregateMm], 0);
  const gravelKg = clampMin(totalAggregatesKg - sandKg, 0);

  const waterCorrectedL = calculateMoistureCorrection({
    waterTheoreticalL: waterLPerM3,
    sandKg,
    gravelKg,
    sandMoisturePct: input.sandMoisturePct,
    gravelMoisturePct: input.gravelMoisturePct,
    sandAbsorptionPct: input.sandAbsorptionPct,
    gravelAbsorptionPct: input.gravelAbsorptionPct,
  });

  const admixture = calculateAdmixturePerM3({
    admixtureEnabled: input.admixtureEnabled,
    admixtureMode: input.admixtureMode,
    admixturePctOfCement: input.admixturePctOfCement,
    admixtureLPerM3: input.admixtureLPerM3,
    cementKg,
  });

  const estimatedCost = calculateConcreteCost({
    cementKg,
    sandKg,
    gravelKg,
    admixtureAmount: admixture.amount,
    cementPrice: input.cementPrice,
    sandPrice: input.sandPrice,
    gravelPrice: input.gravelPrice,
    admixturePrice: input.admixturePrice,
  });

  const perM3: ConcreteMixPerM3 = {
    cementKg: round(cementKg, 1),
    cementBags50Kg: round(cementKg / 50, 2),
    waterTheoreticalL: round(waterLPerM3, 0),
    waterCorrectedL: round(waterCorrectedL, 0),
    sandKg: round(sandKg, 0),
    sandM3Approx: round(sandKg / input.sandDensityKgM3, 3),
    gravelKg: round(gravelKg, 0),
    gravelM3Approx: round(gravelKg / input.gravelDensityKgM3, 3),
    admixtureAmount: round(admixture.amount, 2),
    admixtureUnit: admixture.unit,
    waterCementRatio: round(waterCementRatio, 3),
    estimatedCost: round(estimatedCost, 0),
  };

  const totals = calculateMaterialTotals({
    volumeM3: input.volumeM3,
    perM3,
  });

  return { perM3, totals };
}

export function calculateMoistureCorrection(params: {
  waterTheoreticalL: number;
  sandKg: number;
  gravelKg: number;
  sandMoisturePct: number;
  gravelMoisturePct: number;
  sandAbsorptionPct: number;
  gravelAbsorptionPct: number;
}): number {
  const waterFromMoisture =
    (params.sandKg * params.sandMoisturePct) / 100 + (params.gravelKg * params.gravelMoisturePct) / 100;

  const waterForAbsorption =
    (params.sandKg * params.sandAbsorptionPct) / 100 + (params.gravelKg * params.gravelAbsorptionPct) / 100;

  const corrected = params.waterTheoreticalL + waterForAbsorption - waterFromMoisture;
  return clampMin(corrected, 0);
}

function calculateAdmixturePerM3(params: {
  admixtureEnabled: boolean;
  admixtureMode: "pct_cement" | "l_per_m3";
  admixturePctOfCement?: number;
  admixtureLPerM3?: number;
  cementKg: number;
}): { amount: number; unit: "L" | "kg" } {
  if (!params.admixtureEnabled) return { amount: 0, unit: "L" };

  if (params.admixtureMode === "l_per_m3") {
    return { amount: clampMin(params.admixtureLPerM3 ?? 0, 0), unit: "L" };
  }

  const pct = clampMin(params.admixturePctOfCement ?? 0, 0);
  return { amount: clampMin((params.cementKg * pct) / 100, 0), unit: "kg" };
}

export function calculateMaterialTotals(params: { volumeM3: number; perM3: ConcreteMixPerM3 }): ConcreteMixTotals {
  const v = params.volumeM3;
  const per = params.perM3;

  return {
    cementKgTotal: round(per.cementKg * v, 1),
    cementBags50KgTotal: round(per.cementBags50Kg * v, 2),
    waterLTotal: round(per.waterCorrectedL * v, 0),
    sandKgTotal: round(per.sandKg * v, 0),
    gravelKgTotal: round(per.gravelKg * v, 0),
    admixtureTotal: round(per.admixtureAmount * v, 2),
    estimatedCostTotal: round(per.estimatedCost * v, 0),
  };
}

export function calculateConcreteCost(params: {
  cementKg: number;
  sandKg: number;
  gravelKg: number;
  admixtureAmount: number;
  cementPrice?: number;
  sandPrice?: number;
  gravelPrice?: number;
  admixturePrice?: number;
}): number {
  const cementCost = (params.cementPrice ?? 0) * params.cementKg;
  const sandCost = (params.sandPrice ?? 0) * params.sandKg;
  const gravelCost = (params.gravelPrice ?? 0) * params.gravelKg;
  const admixtureCost = (params.admixturePrice ?? 0) * params.admixtureAmount;

  const total = cementCost + sandCost + gravelCost + admixtureCost;
  return Number.isFinite(total) ? total : 0;
}
