import { z } from "zod";

export const MasonryBlockTypeSchema = z.enum(["BLOCK_15", "BLOCK_20", "BRICK_10"]);

const BLOCK_FACE_M2: Record<z.infer<typeof MasonryBlockTypeSchema>, number> = {
  // Dimensions usuelles (cm) -> face 40x20 = 0.08 m²
  BLOCK_15: 0.4 * 0.2,
  BLOCK_20: 0.4 * 0.2,
  // Brique 20x10 (approximatif)
  BRICK_10: 0.2 * 0.1,
};

export const MasonryAdvancedInputSchema = z.object({
  wallLengthM: z.number().positive(),
  wallHeightM: z.number().positive(),
  thicknessCm: z.number().positive(),
  blockType: MasonryBlockTypeSchema,
  openingsAreaM2: z.number().min(0),
  wastePercent: z.number().min(0),
});

export type MasonryAdvancedInput = z.infer<typeof MasonryAdvancedInputSchema>;

export type MasonryAdvancedOutput = {
  grossAreaM2: number;
  netAreaM2: number;
  blocksCount: number;
  mortarEstimateM3: number;
  mortarBagsCement50Kg: number;
};

function round(value: number, digits: number) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

export function computeMasonryAdvanced(input: MasonryAdvancedInput): MasonryAdvancedOutput {
  const parsed = MasonryAdvancedInputSchema.parse(input);

  const grossAreaM2 = parsed.wallLengthM * parsed.wallHeightM;
  const netAreaM2 = Math.max(0, grossAreaM2 - parsed.openingsAreaM2);

  const blockFaceM2 = BLOCK_FACE_M2[parsed.blockType];
  const rawBlocks = blockFaceM2 > 0 ? netAreaM2 / blockFaceM2 : 0;
  const blocksWithWaste = rawBlocks * (1 + parsed.wastePercent / 100);
  const blocksCount = Math.max(0, Math.ceil(blocksWithWaste));

  // Mortier: estimation simple ~ 0.02 m3 par m2 de mur (ordre de grandeur)
  const mortarEstimateM3 = netAreaM2 * 0.02 * (1 + parsed.wastePercent / 100);

  // Ciment pour mortier: ~ 250 kg/m3 (ordre de grandeur)
  const cementKg = mortarEstimateM3 * 250;
  const mortarBagsCement50Kg = Math.max(0, Math.ceil(cementKg / 50));

  return {
    grossAreaM2: round(grossAreaM2, 3),
    netAreaM2: round(netAreaM2, 3),
    blocksCount,
    mortarEstimateM3: round(mortarEstimateM3, 3),
    mortarBagsCement50Kg,
  };
}
