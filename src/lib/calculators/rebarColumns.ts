import { z } from "zod";

export const RebarColumnsInputSchema = z.object({
  columnsCount: z.number().int().min(1),
  columnHeightM: z.number().positive(),
  longitudinalBarsCount: z.number().int().min(1),
  longitudinalBarLengthM: z.number().positive().optional(),
  stirrupSpacingCm: z.number().positive(),
  columnWidthCm: z.number().positive(),
  columnDepthCm: z.number().positive(),
  coverCm: z.number().min(0),
  overlapM: z.number().min(0),
  wastePercent: z.number().min(0),
  stirrupHookLengthCm: z.number().min(0),
  diameterLongitudinalMm: z.number().positive(),
  diameterStirrupsMm: z.number().positive(),
});

export type RebarColumnsInput = z.infer<typeof RebarColumnsInputSchema>;

export type RebarColumnsOutput = {
  longitudinalTotalLengthM: number;
  stirrupsCount: number;
  stirrupsTotalLengthM: number;
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

export function computeRebarColumns(input: RebarColumnsInput): RebarColumnsOutput {
  const p = RebarColumnsInputSchema.parse(input);

  const longitudinalBarLengthM = p.longitudinalBarLengthM ?? p.columnHeightM;
  const longitudinalPerColumnM = p.longitudinalBarsCount * (longitudinalBarLengthM + p.overlapM);
  const longitudinalTotalLengthM = longitudinalPerColumnM * p.columnsCount;

  const usableHeightM = Math.max(0, p.columnHeightM);
  const spacingM = p.stirrupSpacingCm / 100;
  const stirrupsPerColumn = Math.max(1, Math.floor(usableHeightM / spacingM) + 1);
  const stirrupsCount = stirrupsPerColumn * p.columnsCount;

  const innerWidthCm = Math.max(0, p.columnWidthCm - 2 * p.coverCm);
  const innerDepthCm = Math.max(0, p.columnDepthCm - 2 * p.coverCm);
  const perimeterCm = 2 * (innerWidthCm + innerDepthCm);
  const stirrupLengthM = (perimeterCm + 2 * p.stirrupHookLengthCm) / 100;
  const stirrupsTotalLengthM = stirrupsCount * stirrupLengthM;

  const totalLengthMNoWaste = longitudinalTotalLengthM + stirrupsTotalLengthM;
  const totalLengthM = totalLengthMNoWaste * (1 + p.wastePercent / 100);

  const weightLongitudinal = longitudinalTotalLengthM * kgPerMeter(p.diameterLongitudinalMm);
  const weightStirrups = stirrupsTotalLengthM * kgPerMeter(p.diameterStirrupsMm);
  const totalWeightKg = (weightLongitudinal + weightStirrups) * (1 + p.wastePercent / 100);

  return {
    longitudinalTotalLengthM: round(longitudinalTotalLengthM, 2),
    stirrupsCount,
    stirrupsTotalLengthM: round(stirrupsTotalLengthM, 2),
    totalLengthM: round(totalLengthM, 2),
    totalWeightKg: round(totalWeightKg, 1),
  };
}
