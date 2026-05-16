import { z } from "zod";

export const LabMoistureContentInputSchema = z.object({
  wetMassG: z.number().finite().positive(),
  dryMassG: z.number().finite().positive(),
});

export type LabMoistureContentInput = z.infer<typeof LabMoistureContentInputSchema>;

export type LabMoistureContentOutput = {
  waterMassG: number;
  moisturePercent: number;
};

function round(value: number, digits = 2) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

export function computeLabMoistureContent(input: LabMoistureContentInput): LabMoistureContentOutput {
  const p = LabMoistureContentInputSchema.parse(input);

  const waterMassG = p.wetMassG - p.dryMassG;
  if (waterMassG < 0) {
    throw new Error("invalid_masses");
  }

  const moisturePercent = (waterMassG / p.dryMassG) * 100;

  return {
    waterMassG: round(waterMassG, 1),
    moisturePercent: round(moisturePercent, 2),
  };
}
