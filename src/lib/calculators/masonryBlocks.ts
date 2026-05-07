import { z } from "zod";

export const MasonryBlocksInputSchema = z.object({
  wallLengthM: z.number().positive(),
  wallHeightM: z.number().positive(),
  blockLengthCm: z.number().positive(),
  blockHeightCm: z.number().positive(),
  wastePercent: z.number().min(0).max(100),
  mortarThicknessCm: z.number().min(0).max(5).optional(),
});

export type MasonryBlocksInput = z.infer<typeof MasonryBlocksInputSchema>;

export type MasonryBlocksOutput = {
  wallAreaM2: number;
  blockAreaM2: number;
  blocksCount: number;
  blocksWithWaste: number;
  mortarEstimateM3: number | null;
};

function round(n: number, digits = 2) {
  const p = 10 ** digits;
  return Math.round(n * p) / p;
}

export function computeMasonryBlocks(input: MasonryBlocksInput): MasonryBlocksOutput {
  const wallAreaM2 = input.wallLengthM * input.wallHeightM;

  const blockLengthM = input.blockLengthCm / 100;
  const blockHeightM = input.blockHeightCm / 100;
  const blockAreaM2 = blockLengthM * blockHeightM;

  if (blockAreaM2 <= 0) throw new Error("Invalid block size");

  const blocksCount = Math.ceil(wallAreaM2 / blockAreaM2);
  const blocksWithWaste = Math.ceil(blocksCount * (1 + input.wastePercent / 100));

  const thicknessCm = input.mortarThicknessCm ?? null;
  const mortarEstimateM3 = thicknessCm === null ? null : round(wallAreaM2 * (thicknessCm / 100), 3);

  return {
    wallAreaM2: round(wallAreaM2, 2),
    blockAreaM2: round(blockAreaM2, 4),
    blocksCount,
    blocksWithWaste,
    mortarEstimateM3,
  };
}
