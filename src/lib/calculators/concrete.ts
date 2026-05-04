import { z } from "zod";

export const ConcreteElementTypeSchema = z.enum([
  "dalle",
  "poteau",
  "poutre",
  "semelle_isolee",
  "semelle_filante",
  "longrine",
]);

export const ConcreteInputSchema = z.object({
  elementType: ConcreteElementTypeSchema,
  lengthM: z.number().positive(),
  widthM: z.number().positive(),
  heightM: z.number().positive(),
  quantity: z.number().int().min(1),
  concreteDosageKgM3: z.number().positive(),
  wasteMarginPercent: z.number().min(0),
  pricePerM3: z.number().positive().optional(),
});

export type ConcreteInput = z.infer<typeof ConcreteInputSchema>;

export type ConcreteOutput = {
  volumeTotalM3: number;
  volumeWithWasteM3: number;
  cementEstimateKg: number;
  cementBagsCount: number;
  sandEstimateM3: number;
  gravelEstimateM3: number;
  waterEstimateL: number;
  estimatedCost: number | null;
};

function round(value: number, digits: number) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

export function computeConcrete(input: ConcreteInput): ConcreteOutput {
  const parsed = ConcreteInputSchema.parse(input);

  const volumeTotalM3 = parsed.lengthM * parsed.widthM * parsed.heightM * parsed.quantity;
  const volumeWithWasteM3 = volumeTotalM3 * (1 + parsed.wasteMarginPercent / 100);

  const cementEstimateKg = volumeWithWasteM3 * parsed.concreteDosageKgM3;
  const cementBagsCount = Math.max(0, Math.ceil(cementEstimateKg / 50));

  const sandEstimateM3 = volumeWithWasteM3 * 0.5;
  const gravelEstimateM3 = volumeWithWasteM3 * 0.8;

  const waterEstimateL = cementEstimateKg * 0.5;

  const estimatedCost = parsed.pricePerM3 ? volumeWithWasteM3 * parsed.pricePerM3 : null;

  return {
    volumeTotalM3: round(volumeTotalM3, 3),
    volumeWithWasteM3: round(volumeWithWasteM3, 3),
    cementEstimateKg: round(cementEstimateKg, 0),
    cementBagsCount,
    sandEstimateM3: round(sandEstimateM3, 3),
    gravelEstimateM3: round(gravelEstimateM3, 3),
    waterEstimateL: round(waterEstimateL, 0),
    estimatedCost: estimatedCost !== null ? round(estimatedCost, 0) : null,
  };
}
