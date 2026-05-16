import { z } from "zod";

export const LabCbrSimplifiedInputSchema = z.object({
  cbr25: z.number().finite().min(0).max(100),
  cbr5: z.number().finite().min(0).max(100),
});

export type LabCbrSimplifiedInput = z.infer<typeof LabCbrSimplifiedInputSchema>;

export type LabCbrSimplifiedOutput = {
  cbr25: number;
  cbr5: number;
  cbrRetained: number;
};

function round(value: number, digits = 1) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

export function computeLabCbrSimplified(input: LabCbrSimplifiedInput): LabCbrSimplifiedOutput {
  const p = LabCbrSimplifiedInputSchema.parse(input);

  const retained = Math.max(p.cbr25, p.cbr5);

  return {
    cbr25: round(p.cbr25, 1),
    cbr5: round(p.cbr5, 1),
    cbrRetained: round(retained, 1),
  };
}
