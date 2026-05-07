import { z } from "zod";

export const PaintInputSchema = z.object({
  roomLengthM: z.number().positive(),
  roomWidthM: z.number().positive(),
  wallHeightM: z.number().positive(),
  coatsCount: z.number().int().min(1).max(10),
  coverageM2PerL: z.number().positive(),
  openingsAreaM2: z.number().min(0).optional(),
  wastePercent: z.number().min(0).max(100).optional(),
  potCapacityL: z.number().positive().optional(),
});

export type PaintInput = z.infer<typeof PaintInputSchema>;

export type PaintOutput = {
  wallsAreaM2: number;
  paintAreaM2: number;
  litersNeeded: number;
  litersWithWaste: number;
  potsCount: number | null;
};

function round(n: number, digits = 2) {
  const p = 10 ** digits;
  return Math.round(n * p) / p;
}

export function computePaint(input: PaintInput): PaintOutput {
  const perimeterM = 2 * (input.roomLengthM + input.roomWidthM);
  const wallsAreaM2 = perimeterM * input.wallHeightM;

  const openings = input.openingsAreaM2 ?? 0;
  const netWalls = Math.max(0, wallsAreaM2 - openings);

  const paintAreaM2 = netWalls * input.coatsCount;
  const litersNeeded = paintAreaM2 / input.coverageM2PerL;

  const waste = input.wastePercent ?? 0;
  const litersWithWaste = litersNeeded * (1 + waste / 100);

  const potsCount = input.potCapacityL ? Math.ceil(litersWithWaste / input.potCapacityL) : null;

  return {
    wallsAreaM2: round(wallsAreaM2, 2),
    paintAreaM2: round(paintAreaM2, 2),
    litersNeeded: round(litersNeeded, 2),
    litersWithWaste: round(litersWithWaste, 2),
    potsCount,
  };
}
