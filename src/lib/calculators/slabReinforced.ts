import { z } from "zod";

export const SlabReinforcedInputSchema = z.object({
  lengthM: z.number().finite().positive(),
  widthM: z.number().finite().positive(),
  thicknessM: z.number().finite().positive(),
  wastePercent: z.number().finite().min(0).max(50).default(8),

  diameterXmm: z.number().finite().positive(),
  spacingXcm: z.number().finite().positive(),
  diameterYmm: z.number().finite().positive(),
  spacingYcm: z.number().finite().positive(),

  overlapM: z.number().finite().min(0).default(0.4),

  pricePerM3Concrete: z.number().finite().min(0).optional(),
  pricePerKgSteel: z.number().finite().min(0).optional(),
});

export type SlabReinforcedInput = z.infer<typeof SlabReinforcedInputSchema>;

export type SlabReinforcedOutput = {
  areaM2: number;
  concreteVolumeM3: number;
  concreteVolumeWithWasteM3: number;

  barsXCount: number;
  barXLengthM: number;
  barsYCount: number;
  barYLengthM: number;

  totalSteelLengthM: number;
  totalSteelWeightKg: number;

  concreteCost: number | null;
  steelCost: number | null;
  totalCost: number | null;
};

function round(value: number, digits = 2) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

function kgPerMeter(diameterMm: number): number {
  return (diameterMm * diameterMm) / 162;
}

export function computeSlabReinforced(input: SlabReinforcedInput): SlabReinforcedOutput {
  const p = SlabReinforcedInputSchema.parse(input);

  const areaM2 = p.lengthM * p.widthM;
  const concreteVolumeM3 = areaM2 * p.thicknessM;
  const wasteFactor = 1 + p.wastePercent / 100;
  const concreteVolumeWithWasteM3 = concreteVolumeM3 * wasteFactor;

  const spacingXm = p.spacingXcm / 100;
  const spacingYm = p.spacingYcm / 100;

  const barsXCount = Math.max(1, Math.floor(p.widthM / spacingXm) + 1);
  const barsYCount = Math.max(1, Math.floor(p.lengthM / spacingYm) + 1);

  const barXLengthM = p.lengthM + p.overlapM;
  const barYLengthM = p.widthM + p.overlapM;

  const totalSteelLengthMNoWaste = barsXCount * barXLengthM + barsYCount * barYLengthM;
  const totalSteelLengthM = totalSteelLengthMNoWaste * wasteFactor;

  const weightX = barsXCount * barXLengthM * kgPerMeter(p.diameterXmm);
  const weightY = barsYCount * barYLengthM * kgPerMeter(p.diameterYmm);
  const totalSteelWeightKg = (weightX + weightY) * wasteFactor;

  const concreteCost = p.pricePerM3Concrete !== undefined ? concreteVolumeWithWasteM3 * p.pricePerM3Concrete : null;
  const steelCost = p.pricePerKgSteel !== undefined ? totalSteelWeightKg * p.pricePerKgSteel : null;
  const totalCost = concreteCost !== null && steelCost !== null ? concreteCost + steelCost : null;

  return {
    areaM2: round(areaM2, 2),
    concreteVolumeM3: round(concreteVolumeM3, 3),
    concreteVolumeWithWasteM3: round(concreteVolumeWithWasteM3, 3),

    barsXCount,
    barXLengthM: round(barXLengthM, 2),
    barsYCount,
    barYLengthM: round(barYLengthM, 2),

    totalSteelLengthM: round(totalSteelLengthM, 1),
    totalSteelWeightKg: round(totalSteelWeightKg, 1),

    concreteCost: concreteCost !== null ? round(concreteCost, 0) : null,
    steelCost: steelCost !== null ? round(steelCost, 0) : null,
    totalCost: totalCost !== null ? round(totalCost, 0) : null,
  };
}
