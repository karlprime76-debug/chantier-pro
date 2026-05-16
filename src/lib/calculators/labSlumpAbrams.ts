import { z } from "zod";

export const LabSlumpAbramsInputSchema = z.object({
  coneHeightMm: z.number().finite().positive().default(300),
  measuredHeightMm: z.number().finite().positive(),
});

export type LabSlumpAbramsInput = z.infer<typeof LabSlumpAbramsInputSchema>;

export type LabSlumpAbramsOutput = {
  slumpMm: number;
  interpretation: string;
};

function round(value: number, digits = 0) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

function interpretSlump(slumpMm: number): string {
  if (slumpMm < 10) return "Très ferme";
  if (slumpMm < 50) return "Ferme";
  if (slumpMm < 100) return "Plastique";
  if (slumpMm < 160) return "Très plastique";
  return "Fluide";
}

export function computeLabSlumpAbrams(input: LabSlumpAbramsInput): LabSlumpAbramsOutput {
  const p = LabSlumpAbramsInputSchema.parse(input);

  const slumpMm = p.coneHeightMm - p.measuredHeightMm;
  if (slumpMm < 0) {
    throw new Error("invalid_slump");
  }

  return {
    slumpMm: round(slumpMm, 0),
    interpretation: interpretSlump(slumpMm),
  };
}
