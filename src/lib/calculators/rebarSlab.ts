import { z } from "zod";

export const RebarSlabInputSchema = z.object({
  slabLengthM: z.number().positive(),
  slabWidthM: z.number().positive(),
  spacingXcm: z.number().positive(),
  spacingYcm: z.number().positive(),
  overlapM: z.number().min(0),
  wastePercent: z.number().min(0),
  diameterMm: z.number().positive(),
});

export type RebarSlabInput = z.infer<typeof RebarSlabInputSchema>;

export type RebarSlabOutput = {
  barsXCount: number;
  barsYCount: number;
  totalLengthM: number;
  totalWeightKg: number;
};

function round(value: number, digits: number) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

function kgPerMeter(diameterMm: number): number {
  return (diameterMm * diameterMm) / 162;
}

export function computeRebarSlab(input: RebarSlabInput): RebarSlabOutput {
  const p = RebarSlabInputSchema.parse(input);

  const spacingXm = p.spacingXcm / 100;
  const spacingYm = p.spacingYcm / 100;

  const barsXCount = Math.max(1, Math.floor(p.slabWidthM / spacingXm) + 1);
  const barsYCount = Math.max(1, Math.floor(p.slabLengthM / spacingYm) + 1);

  const barXLengthM = p.slabLengthM + p.overlapM;
  const barYLengthM = p.slabWidthM + p.overlapM;

  const totalLengthNoWaste = barsXCount * barXLengthM + barsYCount * barYLengthM;
  const totalLengthM = totalLengthNoWaste * (1 + p.wastePercent / 100);
  const totalWeightKg = totalLengthM * kgPerMeter(p.diameterMm);

  return {
    barsXCount,
    barsYCount,
    totalLengthM: round(totalLengthM, 2),
    totalWeightKg: round(totalWeightKg, 1),
  };
}
