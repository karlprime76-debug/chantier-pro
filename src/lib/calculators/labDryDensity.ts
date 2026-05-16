import { z } from "zod";

export const LabDryDensityInputSchema = z.object({
  wetDensityKgPerM3: z.number().finite().positive(),
  moisturePercent: z.number().finite().min(0).max(200),
});

export type LabDryDensityInput = z.infer<typeof LabDryDensityInputSchema>;

export type LabDryDensityOutput = {
  dryDensityKgPerM3: number;
};

function round(value: number, digits = 1) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

export function computeLabDryDensity(input: LabDryDensityInput): LabDryDensityOutput {
  const p = LabDryDensityInputSchema.parse(input);

  const w = p.moisturePercent / 100;
  const denom = 1 + w;
  if (denom <= 0) throw new Error("invalid_denominator");

  const dryDensityKgPerM3 = p.wetDensityKgPerM3 / denom;

  return {
    dryDensityKgPerM3: round(dryDensityKgPerM3, 1),
  };
}
