import { z } from "zod";

export type LabSieveRow = {
  sieveMm: number;
  retainedG: number;
};

export const LabSieveAnalysisInputSchema = z.object({
  totalMassG: z.number().finite().positive(),
  rows: z
    .array(
      z.object({
        sieveMm: z.number().finite().positive(),
        retainedG: z.number().finite().min(0),
      }),
    )
    .min(1)
    .max(20),
});

export type LabSieveAnalysisInput = z.infer<typeof LabSieveAnalysisInputSchema>;

export type LabSieveAnalysisComputedRow = {
  sieveMm: number;
  retainedG: number;
  retainedPercent: number;
  retainedCumulativePercent: number;
  passingCumulativePercent: number;
};

export type LabSieveAnalysisOutput = {
  totalMassG: number;
  sumRetainedG: number;
  diffG: number;
  rows: LabSieveAnalysisComputedRow[];
};

function round(value: number, digits = 2) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

export function computeLabSieveAnalysis(input: LabSieveAnalysisInput): LabSieveAnalysisOutput {
  const p = LabSieveAnalysisInputSchema.parse(input);

  const rowsSorted = [...p.rows].sort((a, b) => b.sieveMm - a.sieveMm);
  const sumRetainedG = rowsSorted.reduce((acc, r) => acc + r.retainedG, 0);
  const diffG = p.totalMassG - sumRetainedG;

  if (p.totalMassG <= 0) {
    throw new Error("invalid_total");
  }

  let retainedCum = 0;
  const computed: LabSieveAnalysisComputedRow[] = rowsSorted.map((r) => {
    const retainedPercent = (r.retainedG / p.totalMassG) * 100;
    retainedCum += retainedPercent;
    const passingCum = Math.max(0, 100 - retainedCum);

    return {
      sieveMm: r.sieveMm,
      retainedG: round(r.retainedG, 1),
      retainedPercent: round(retainedPercent, 2),
      retainedCumulativePercent: round(retainedCum, 2),
      passingCumulativePercent: round(passingCum, 2),
    };
  });

  return {
    totalMassG: round(p.totalMassG, 1),
    sumRetainedG: round(sumRetainedG, 1),
    diffG: round(diffG, 1),
    rows: computed,
  };
}
