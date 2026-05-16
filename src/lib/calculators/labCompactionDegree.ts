import { z } from "zod";

export const LabCompactionDegreeInputSchema = z.object({
  dryDensityKgPerM3: z.number().finite().positive(),
  maxDryDensityKgPerM3: z.number().finite().positive(),
  thresholdPercent: z.number().finite().min(0).max(200).default(95),
});

export type LabCompactionDegreeInput = z.infer<typeof LabCompactionDegreeInputSchema>;

export type LabCompactionDegreeOutput = {
  compactionPercent: number;
  meetsThreshold: boolean;
};

function round(value: number, digits = 1) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

export function computeLabCompactionDegree(input: LabCompactionDegreeInput): LabCompactionDegreeOutput {
  const p = LabCompactionDegreeInputSchema.parse(input);

  if (p.maxDryDensityKgPerM3 <= 0) throw new Error("invalid_max_density");

  const compactionPercent = (p.dryDensityKgPerM3 / p.maxDryDensityKgPerM3) * 100;
  const meetsThreshold = compactionPercent >= p.thresholdPercent;

  return {
    compactionPercent: round(compactionPercent, 1),
    meetsThreshold,
  };
}
