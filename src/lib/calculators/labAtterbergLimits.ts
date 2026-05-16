import { z } from "zod";

export const LabAtterbergLimitsInputSchema = z.object({
  liquidLimitLL: z.number().finite().positive(),
  plasticLimitPL: z.number().finite().positive(),
});

export type LabAtterbergLimitsInput = z.infer<typeof LabAtterbergLimitsInputSchema>;

export type LabAtterbergLimitsOutput = {
  plasticityIndexIP: number;
  interpretation: string;
};

function round(value: number, digits = 1) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

function interpretIp(ip: number): string {
  if (ip < 5) return "Faible plasticité";
  if (ip < 15) return "Plasticité moyenne";
  if (ip < 30) return "Forte plasticité";
  return "Très forte plasticité";
}

export function computeLabAtterbergLimits(input: LabAtterbergLimitsInput): LabAtterbergLimitsOutput {
  const p = LabAtterbergLimitsInputSchema.parse(input);

  const ip = p.liquidLimitLL - p.plasticLimitPL;
  if (ip < 0) {
    throw new Error("invalid_limits");
  }

  return {
    plasticityIndexIP: round(ip, 1),
    interpretation: interpretIp(ip),
  };
}
