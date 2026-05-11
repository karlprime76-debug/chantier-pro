import { z } from "zod";

export const AdvancedSlabInputSchema = z.object({
  lengthM: z.number().finite().positive(),
  widthM: z.number().finite().positive(),
  thicknessM: z.number().finite().positive().default(0.12),

  meshKgPerM2: z.number().finite().positive().default(2.2),
  wastePercent: z.number().finite().min(0).max(50).default(8),

  polyaneOverlapPercent: z.number().finite().min(0).max(50).default(10),

  pricePerM3Concrete: z.number().finite().positive().optional(),
  pricePerKgSteel: z.number().finite().positive().optional(),
  pricePerM2Polyane: z.number().finite().positive().optional(),
  pricePerM2Formwork: z.number().finite().positive().optional(),
});

export type AdvancedSlabInput = z.infer<typeof AdvancedSlabInputSchema>;

export type AdvancedSlabOutput = {
  areaM2: number;
  concreteVolumeM3: number;
  steelEstimateKg: number;
  perimeterM: number;
  edgeFormworkAreaM2: number;
  polyaneAreaM2: number;
  estimatedCost: number | null;
  summary: {
    areaM2: number;
    thicknessM: number;
    concreteVolumeM3: number;
    steelEstimateKg: number;
    polyaneAreaM2: number;
    edgeFormworkAreaM2: number;
  };
};

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function computeAdvancedSlab(input: AdvancedSlabInput): AdvancedSlabOutput {
  const areaM2 = input.lengthM * input.widthM;
  const wasteFactor = 1 + input.wastePercent / 100;

  const concreteVolumeM3 = areaM2 * input.thicknessM * wasteFactor;
  const steelEstimateKg = areaM2 * input.meshKgPerM2 * wasteFactor;

  const perimeterM = 2 * (input.lengthM + input.widthM);
  const edgeFormworkAreaM2 = perimeterM * input.thicknessM;

  const polyaneAreaM2 = areaM2 * (1 + input.polyaneOverlapPercent / 100);

  const hasAllPrices =
    input.pricePerM3Concrete !== undefined &&
    input.pricePerKgSteel !== undefined &&
    input.pricePerM2Polyane !== undefined &&
    input.pricePerM2Formwork !== undefined;

  const estimatedCost = hasAllPrices
    ? round2(
        concreteVolumeM3 * (input.pricePerM3Concrete as number) +
          steelEstimateKg * (input.pricePerKgSteel as number) +
          polyaneAreaM2 * (input.pricePerM2Polyane as number) +
          edgeFormworkAreaM2 * (input.pricePerM2Formwork as number),
      )
    : null;

  return {
    areaM2: round2(areaM2),
    concreteVolumeM3: round2(concreteVolumeM3),
    steelEstimateKg: round2(steelEstimateKg),
    perimeterM: round2(perimeterM),
    edgeFormworkAreaM2: round2(edgeFormworkAreaM2),
    polyaneAreaM2: round2(polyaneAreaM2),
    estimatedCost,
    summary: {
      areaM2: round2(areaM2),
      thicknessM: round2(input.thicknessM),
      concreteVolumeM3: round2(concreteVolumeM3),
      steelEstimateKg: round2(steelEstimateKg),
      polyaneAreaM2: round2(polyaneAreaM2),
      edgeFormworkAreaM2: round2(edgeFormworkAreaM2),
    },
  };
}
