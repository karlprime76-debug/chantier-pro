import { z } from "zod";

export const LabFreshDensityInputSchema = z.object({
  containerVolumeL: z.number().finite().positive(),
  emptyContainerMassKg: z.number().finite().min(0),
  filledContainerMassKg: z.number().finite().positive(),
});

export type LabFreshDensityInput = z.infer<typeof LabFreshDensityInputSchema>;

export type LabFreshDensityOutput = {
  concreteMassKg: number;
  volumeM3: number;
  densityKgPerM3: number;
};

function round(value: number, digits = 2) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

export function computeLabFreshDensity(input: LabFreshDensityInput): LabFreshDensityOutput {
  const p = LabFreshDensityInputSchema.parse(input);

  const concreteMassKg = p.filledContainerMassKg - p.emptyContainerMassKg;
  if (!(concreteMassKg > 0)) {
    throw new Error("invalid_mass");
  }

  const volumeM3 = p.containerVolumeL / 1000;
  if (!(volumeM3 > 0)) {
    throw new Error("invalid_volume");
  }

  const densityKgPerM3 = concreteMassKg / volumeM3;

  return {
    concreteMassKg: round(concreteMassKg, 3),
    volumeM3: round(volumeM3, 6),
    densityKgPerM3: round(densityKgPerM3, 1),
  };
}
