import { z } from "zod";

export const LabCompressiveStrengthInputSchema = z.object({
  strengthsMpa: z
    .array(z.number().finite().positive())
    .min(1)
    .max(12),
});

export type LabCompressiveStrengthInput = z.infer<typeof LabCompressiveStrengthInputSchema>;

export type LabCompressiveStrengthOutput = {
  count: number;
  averageMpa: number;
  minMpa: number;
  maxMpa: number;
  rangeMpa: number;
  maxDeviationFromAverageMpa: number;
};

function round(value: number, digits = 2) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

export function computeLabCompressiveStrength(input: LabCompressiveStrengthInput): LabCompressiveStrengthOutput {
  const p = LabCompressiveStrengthInputSchema.parse(input);
  const n = p.strengthsMpa.length;

  const sum = p.strengthsMpa.reduce((acc, v) => acc + v, 0);
  const avg = sum / n;

  const min = Math.min(...p.strengthsMpa);
  const max = Math.max(...p.strengthsMpa);

  const deviation = Math.max(...p.strengthsMpa.map((v) => Math.abs(v - avg)));

  return {
    count: n,
    averageMpa: round(avg, 2),
    minMpa: round(min, 2),
    maxMpa: round(max, 2),
    rangeMpa: round(max - min, 2),
    maxDeviationFromAverageMpa: round(deviation, 2),
  };
}
