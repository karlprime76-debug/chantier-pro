import { z } from "zod";

export const LabPressToMpaInputSchema = z.object({
  loadKn: z.number().finite().positive(),
  specimenDiameterMm: z.number().finite().positive().default(150),
});

export type LabPressToMpaInput = z.infer<typeof LabPressToMpaInputSchema>;

export type LabPressToMpaOutput = {
  areaMm2: number;
  areaM2: number;
  stressMpa: number;
};

function round(value: number, digits = 2) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

export function computeLabPressToMpa(input: LabPressToMpaInput): LabPressToMpaOutput {
  const p = LabPressToMpaInputSchema.parse(input);

  const radiusMm = p.specimenDiameterMm / 2;
  const areaMm2 = Math.PI * radiusMm * radiusMm;
  const areaM2 = areaMm2 * 1e-6;

  const forceN = p.loadKn * 1000;
  const stressPa = forceN / areaM2;
  const stressMpa = stressPa / 1e6;

  return {
    areaMm2: round(areaMm2, 0),
    areaM2: round(areaM2, 6),
    stressMpa: round(stressMpa, 2),
  };
}
