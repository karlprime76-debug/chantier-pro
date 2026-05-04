import { z } from "zod";

export const SteelDiameterSchema = z.enum(["HA6", "HA8", "HA10", "HA12", "HA14", "HA16", "HA20", "HA25"]);

const DIAMETER_MM: Record<z.infer<typeof SteelDiameterSchema>, number> = {
  HA6: 6,
  HA8: 8,
  HA10: 10,
  HA12: 12,
  HA14: 14,
  HA16: 16,
  HA20: 20,
  HA25: 25,
};

export const SteelInputSchema = z.object({
  diameter: SteelDiameterSchema,
  unitLengthM: z.number().positive(),
  count: z.number().int().min(1),
  overlapM: z.number().min(0),
  lossPercent: z.number().min(0),
  pricePerKg: z.number().positive().optional(),
  pricePerBar: z.number().positive().optional(),
});

export type SteelInput = z.infer<typeof SteelInputSchema>;

export type SteelOutput = {
  diameterMm: number;
  kgPerM: number;
  totalLengthM: number;
  totalLengthWithLossM: number;
  totalWeightKg: number;
  bars12mCount: number;
  estimatedCost: number | null;
};

function round(value: number, digits: number) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

export function computeSteel(input: SteelInput): SteelOutput {
  const parsed = SteelInputSchema.parse(input);

  const diameterMm = DIAMETER_MM[parsed.diameter];
  const kgPerM = (diameterMm ** 2) / 162;

  const totalLengthM = (parsed.unitLengthM + parsed.overlapM) * parsed.count;
  const totalLengthWithLossM = totalLengthM * (1 + parsed.lossPercent / 100);

  const totalWeightKg = totalLengthWithLossM * kgPerM;
  const bars12mCount = Math.max(0, Math.ceil(totalLengthWithLossM / 12));

  const estimatedCost = parsed.pricePerKg
    ? totalWeightKg * parsed.pricePerKg
    : parsed.pricePerBar
      ? bars12mCount * parsed.pricePerBar
      : null;

  return {
    diameterMm,
    kgPerM: round(kgPerM, 3),
    totalLengthM: round(totalLengthM, 3),
    totalLengthWithLossM: round(totalLengthWithLossM, 3),
    totalWeightKg: round(totalWeightKg, 3),
    bars12mCount,
    estimatedCost: estimatedCost !== null ? round(estimatedCost, 0) : null,
  };
}
