import { z } from "zod";

export const EarthworkInputSchema = z.object({
  lengthM: z.number().positive(),
  widthM: z.number().positive(),
  depthM: z.number().positive(),
  swellCoefficient: z.number().min(1),
  transportPricePerM3: z.number().positive().optional(),
});

export type EarthworkInput = z.infer<typeof EarthworkInputSchema>;

export type EarthworkOutput = {
  excavationVolumeM3: number;
  volumeToEvacuateM3: number;
  estimatedTransportCost: number | null;
};

function round(value: number, digits: number) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

export function computeEarthwork(input: EarthworkInput): EarthworkOutput {
  const parsed = EarthworkInputSchema.parse(input);

  const excavationVolumeM3 = parsed.lengthM * parsed.widthM * parsed.depthM;
  const volumeToEvacuateM3 = excavationVolumeM3 * parsed.swellCoefficient;
  const estimatedTransportCost = parsed.transportPricePerM3 ? volumeToEvacuateM3 * parsed.transportPricePerM3 : null;

  return {
    excavationVolumeM3: round(excavationVolumeM3, 3),
    volumeToEvacuateM3: round(volumeToEvacuateM3, 3),
    estimatedTransportCost: estimatedTransportCost !== null ? round(estimatedTransportCost, 0) : null,
  };
}
