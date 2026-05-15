import { z } from "zod";

export const RebarBeamsInputSchema = z.object({
  beamsCount: z.number().int().min(1),
  beamLengthM: z.number().positive(),
  topBarsCount: z.number().int().min(0),
  bottomBarsCount: z.number().int().min(0),
  overlapM: z.number().min(0),
  stirrupSpacingCm: z.number().positive(),
  beamWidthCm: z.number().positive(),
  beamHeightCm: z.number().positive(),
  coverCm: z.number().min(0),
  stirrupHookLengthCm: z.number().min(0),
  wastePercent: z.number().min(0),
  diameterBarsMm: z.number().positive(),
  diameterStirrupsMm: z.number().positive(),
});

export type RebarBeamsInput = z.infer<typeof RebarBeamsInputSchema>;

export type RebarBeamsOutput = {
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

export function computeRebarBeams(input: RebarBeamsInput): RebarBeamsOutput {
  const p = RebarBeamsInputSchema.parse(input);

  const barsPerBeam = Math.max(0, p.topBarsCount) + Math.max(0, p.bottomBarsCount);
  const longitudinalPerBeamM = barsPerBeam * (p.beamLengthM + p.overlapM);
  const longitudinalTotalLengthM = longitudinalPerBeamM * p.beamsCount;

  const spacingM = p.stirrupSpacingCm / 100;
  const stirrupsPerBeam = Math.max(1, Math.floor(p.beamLengthM / spacingM) + 1);
  const stirrupsCount = stirrupsPerBeam * p.beamsCount;

  const innerWidthCm = Math.max(0, p.beamWidthCm - 2 * p.coverCm);
  const innerHeightCm = Math.max(0, p.beamHeightCm - 2 * p.coverCm);
  const perimeterCm = 2 * (innerWidthCm + innerHeightCm);
  const stirrupLengthM = (perimeterCm + 2 * p.stirrupHookLengthCm) / 100;
  const stirrupsTotalLengthM = stirrupsCount * stirrupLengthM;

  const totalLengthMNoWaste = longitudinalTotalLengthM + stirrupsTotalLengthM;
  const totalLengthM = totalLengthMNoWaste * (1 + p.wastePercent / 100);

  const weightLongitudinal = longitudinalTotalLengthM * kgPerMeter(p.diameterBarsMm);
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
