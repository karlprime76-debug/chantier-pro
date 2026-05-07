import { z } from "zod";

export const TilingInputSchema = z.object({
  roomLengthM: z.number().positive(),
  roomWidthM: z.number().positive(),
  tileLengthCm: z.number().positive(),
  tileWidthCm: z.number().positive(),
  wastePercent: z.number().min(0).max(100),
  tilesPerBox: z.number().int().positive().optional(),
});

export type TilingInput = z.infer<typeof TilingInputSchema>;

export type TilingOutput = {
  areaM2: number;
  tileAreaM2: number;
  tilesCount: number;
  tilesWithWaste: number;
  boxesCount: number | null;
};

function round(n: number, digits = 2) {
  const p = 10 ** digits;
  return Math.round(n * p) / p;
}

export function computeTiling(input: TilingInput): TilingOutput {
  const areaM2 = input.roomLengthM * input.roomWidthM;

  const tileAreaM2 = (input.tileLengthCm / 100) * (input.tileWidthCm / 100);
  if (tileAreaM2 <= 0) throw new Error("Invalid tile size");

  const tilesCount = Math.ceil(areaM2 / tileAreaM2);
  const tilesWithWaste = Math.ceil(tilesCount * (1 + input.wastePercent / 100));

  const boxesCount = input.tilesPerBox ? Math.ceil(tilesWithWaste / input.tilesPerBox) : null;

  return {
    areaM2: round(areaM2, 2),
    tileAreaM2: round(tileAreaM2, 4),
    tilesCount,
    tilesWithWaste,
    boxesCount,
  };
}
