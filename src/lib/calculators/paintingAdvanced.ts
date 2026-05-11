import { z } from "zod";

export const PaintingAdvancedInputSchema = z.object({
  wallsAreaM2: z.number().min(0),
  ceilingAreaM2: z.number().min(0),
  coats: z.number().int().min(1),
  coverageM2PerL: z.number().positive(),
  wastePercent: z.number().min(0),
  potSizeL: z.number().positive(),
  pricePerPot: z.number().positive().optional(),
});

export type PaintingAdvancedInput = z.infer<typeof PaintingAdvancedInputSchema>;

export type PaintingAdvancedOutput = {
  totalAreaM2: number;
  litersNeeded: number;
  potsCount: number;
  estimatedCost: number | null;
};

function round(value: number, digits: number) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

export function computePaintingAdvanced(input: PaintingAdvancedInput): PaintingAdvancedOutput {
  const parsed = PaintingAdvancedInputSchema.parse(input);

  const totalAreaM2 = Math.max(0, parsed.wallsAreaM2) + Math.max(0, parsed.ceilingAreaM2);
  const litersBase = (totalAreaM2 * parsed.coats) / parsed.coverageM2PerL;
  const litersNeeded = litersBase * (1 + parsed.wastePercent / 100);

  const potsCount = Math.max(0, Math.ceil(litersNeeded / parsed.potSizeL));
  const estimatedCost = parsed.pricePerPot ? potsCount * parsed.pricePerPot : null;

  return {
    totalAreaM2: round(totalAreaM2, 3),
    litersNeeded: round(litersNeeded, 2),
    potsCount,
    estimatedCost: estimatedCost !== null ? round(estimatedCost, 0) : null,
  };
}
