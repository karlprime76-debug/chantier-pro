import { z } from "zod";

export const SteelWeightInputSchema = z.object({
  diameterMm: z.number().positive(),
  totalLengthM: z.number().positive(),
  barsCount: z.number().int().positive().optional(),
  lengthPerBarM: z.number().positive().optional(),
});

export type SteelWeightInput = z.infer<typeof SteelWeightInputSchema>;

export type SteelWeightOutput = {
  kgPerMeter: number;
  totalWeightKg: number;
  weightPerBarKg: number | null;
};

function round(n: number, digits = 2) {
  const p = 10 ** digits;
  return Math.round(n * p) / p;
}

export function computeSteelWeight(input: SteelWeightInput): SteelWeightOutput {
  const kgPerMeter = (input.diameterMm ** 2) / 162;
  const totalWeightKg = kgPerMeter * input.totalLengthM;

  const weightPerBarKg = input.barsCount && input.lengthPerBarM ? kgPerMeter * input.lengthPerBarM : null;

  return {
    kgPerMeter: round(kgPerMeter, 3),
    totalWeightKg: round(totalWeightKg, 2),
    weightPerBarKg: weightPerBarKg === null ? null : round(weightPerBarKg, 2),
  };
}
