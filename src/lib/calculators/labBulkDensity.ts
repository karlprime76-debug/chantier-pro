import { z } from "zod";

export const LabBulkDensityInputSchema = z.object({
  containerVolumeL: z.number().finite().positive(),
  netMassKg: z.number().finite().positive(),
});

export type LabBulkDensityInput = z.infer<typeof LabBulkDensityInputSchema>;

export type LabBulkDensityOutput = {
  volumeM3: number;
  densityKgPerM3: number;
};

function round(value: number, digits = 2) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

export function computeLabBulkDensity(input: LabBulkDensityInput): LabBulkDensityOutput {
  const p = LabBulkDensityInputSchema.parse(input);

  const volumeM3 = p.containerVolumeL / 1000;
  if (!(volumeM3 > 0)) throw new Error("invalid_volume");

  const densityKgPerM3 = p.netMassKg / volumeM3;

  return {
    volumeM3: round(volumeM3, 6),
    densityKgPerM3: round(densityKgPerM3, 1),
  };
}
