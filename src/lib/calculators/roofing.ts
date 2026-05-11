import { z } from "zod";

export const RoofingInputSchema = z.object({
  buildingLengthM: z.number().positive(),
  buildingWidthM: z.number().positive(),
  slopePercent: z.number().min(0),
  overhangM: z.number().min(0),
  panelCoverAreaM2: z.number().positive(),
  wastePercent: z.number().min(0),
});

export type RoofingInput = z.infer<typeof RoofingInputSchema>;

export type RoofingOutput = {
  planAreaM2: number;
  roofAreaM2: number;
  panelsCount: number;
  accessoriesFactor: number;
};

function round(value: number, digits: number) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

export function computeRoofing(input: RoofingInput): RoofingOutput {
  const parsed = RoofingInputSchema.parse(input);

  const lengthM = parsed.buildingLengthM + 2 * parsed.overhangM;
  const widthM = parsed.buildingWidthM + 2 * parsed.overhangM;
  const planAreaM2 = lengthM * widthM;

  const tan = parsed.slopePercent / 100;
  const slopeFactor = Math.sqrt(1 + tan * tan);
  const roofAreaBaseM2 = planAreaM2 * slopeFactor;
  const roofAreaM2 = roofAreaBaseM2 * (1 + parsed.wastePercent / 100);

  const panelsCount = Math.max(0, Math.ceil(roofAreaM2 / parsed.panelCoverAreaM2));

  // Accessoires: règle simple (vis, faîtière, rives) -> facteur indicatif
  const accessoriesFactor = 0.08;

  return {
    planAreaM2: round(planAreaM2, 3),
    roofAreaM2: round(roofAreaM2, 3),
    panelsCount,
    accessoriesFactor,
  };
}
