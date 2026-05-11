import { z } from "zod";

export const PlasterInputSchema = z.object({
  areaM2: z.number().positive(),
  thicknessMm: z.number().positive(),
  cementDosageKgPerM3: z.number().positive(),
  wastePercent: z.number().min(0),
  pricePerM2: z.number().positive().optional(),
});

export type PlasterInput = z.infer<typeof PlasterInputSchema>;

export type PlasterOutput = {
  mortarVolumeM3: number;
  mortarVolumeWithWasteM3: number;
  cementEstimateKg: number;
  cementBagsCount: number;
  sandEstimateM3: number;
  estimatedCost: number | null;
};

function round(value: number, digits: number) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

export function computePlaster(input: PlasterInput): PlasterOutput {
  const parsed = PlasterInputSchema.parse(input);

  const thicknessM = parsed.thicknessMm / 1000;
  const mortarVolumeM3 = parsed.areaM2 * thicknessM;
  const mortarVolumeWithWasteM3 = mortarVolumeM3 * (1 + parsed.wastePercent / 100);

  const cementEstimateKg = mortarVolumeWithWasteM3 * parsed.cementDosageKgPerM3;
  const cementBagsCount = Math.max(0, Math.ceil(cementEstimateKg / 50));

  // sable: estimation simple ~ 0.7 m3 par m3 de mortier (ordre de grandeur)
  const sandEstimateM3 = mortarVolumeWithWasteM3 * 0.7;

  const estimatedCost = parsed.pricePerM2 ? parsed.areaM2 * parsed.pricePerM2 : null;

  return {
    mortarVolumeM3: round(mortarVolumeM3, 3),
    mortarVolumeWithWasteM3: round(mortarVolumeWithWasteM3, 3),
    cementEstimateKg: round(cementEstimateKg, 0),
    cementBagsCount,
    sandEstimateM3: round(sandEstimateM3, 3),
    estimatedCost: estimatedCost !== null ? round(estimatedCost, 0) : null,
  };
}
