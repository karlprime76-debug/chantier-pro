import { z } from "zod";

export const LabSandFinenessModulusInputSchema = z.object({
  retainedCumulativePercents: z
    .array(z.number().finite().min(0).max(100))
    .min(3)
    .max(10),
});

export type LabSandFinenessModulusInput = z.infer<typeof LabSandFinenessModulusInputSchema>;

export type LabSandFinenessModulusOutput = {
  finenessModulus: number;
  interpretation: string;
};

function round(value: number, digits = 2) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

function interpretMf(mf: number): string {
  if (mf < 2.2) return "Sable fin";
  if (mf < 2.8) return "Sable moyen";
  return "Sable grossier";
}

export function computeLabSandFinenessModulus(input: LabSandFinenessModulusInput): LabSandFinenessModulusOutput {
  const p = LabSandFinenessModulusInputSchema.parse(input);

  const sum = p.retainedCumulativePercents.reduce((acc, v) => acc + v, 0);
  const mf = sum / 100;

  return {
    finenessModulus: round(mf, 2),
    interpretation: interpretMf(mf),
  };
}
