import { z } from "zod";

export const SepticTankInputSchema = z.object({
  usersCount: z.number().finite().int().min(1),
  consumptionLPerPersonPerDay: z.number().finite().positive().default(80),
  retentionDays: z.number().finite().positive().default(3),
  safetyMarginPercent: z.number().finite().min(0).max(100).default(25),

  tankDepthM: z.number().finite().positive().default(1.6),
  tankWidthM: z.number().finite().positive().default(1.2),

  soakawayDays: z.number().finite().positive().default(1),
});

export type SepticTankInput = z.infer<typeof SepticTankInputSchema>;

export type SepticTankOutput = {
  dailyFlowM3: number;
  usefulVolumeM3: number;
  usefulVolumeWithMarginM3: number;
  proposedTankLengthM: number;
  proposedTankWidthM: number;
  proposedTankDepthM: number;
  proposedTankVolumeM3: number;
  soakawayVolumeM3: number;
};

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function computeSepticTank(input: SepticTankInput): SepticTankOutput {
  const dailyFlowM3 = (input.usersCount * input.consumptionLPerPersonPerDay) / 1000;
  const usefulVolumeM3 = dailyFlowM3 * input.retentionDays;
  const usefulVolumeWithMarginM3 = usefulVolumeM3 * (1 + input.safetyMarginPercent / 100);

  const baseAreaM2 = input.tankWidthM * input.tankDepthM;
  const proposedTankLengthM = usefulVolumeWithMarginM3 / baseAreaM2;

  const proposedTankVolumeM3 = proposedTankLengthM * baseAreaM2;

  const soakawayVolumeM3 = dailyFlowM3 * input.soakawayDays;

  return {
    dailyFlowM3: round2(dailyFlowM3),
    usefulVolumeM3: round2(usefulVolumeM3),
    usefulVolumeWithMarginM3: round2(usefulVolumeWithMarginM3),
    proposedTankLengthM: round2(proposedTankLengthM),
    proposedTankWidthM: round2(input.tankWidthM),
    proposedTankDepthM: round2(input.tankDepthM),
    proposedTankVolumeM3: round2(proposedTankVolumeM3),
    soakawayVolumeM3: round2(soakawayVolumeM3),
  };
}
