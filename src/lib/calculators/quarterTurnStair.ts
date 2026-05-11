import { z } from "zod";

export const QuarterTurnStairInputSchema = z.object({
  totalHeightM: z.number().finite().positive(),
  stairWidthM: z.number().finite().positive(),
  targetRiserHeightM: z.number().finite().positive(),
  treadDepthM: z.number().finite().positive(),
  balancedStepsCount: z.number().finite().int().min(0).max(10).default(3),
  slabThicknessM: z.number().finite().positive().default(0.12),
  wastePercent: z.number().finite().min(0).max(50).default(8),
});

export type QuarterTurnStairInput = z.infer<typeof QuarterTurnStairInputSchema>;

export type QuarterTurnStairOutput = {
  stepsCount: number;
  riserHeightM: number;
  balancedStepsCount: number;
  footprintLengthM: number;
  footprintWidthM: number;
  concreteVolumeM3: number;
  formworkSurfaceM2: number;
};

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function safeCeilInt(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.ceil(n));
}

export function computeQuarterTurnStair(input: QuarterTurnStairInput): QuarterTurnStairOutput {
  const stepsCount = Math.max(2, safeCeilInt(input.totalHeightM / input.targetRiserHeightM));
  const riserHeightM = input.totalHeightM / stepsCount;

  const balancedStepsCount = Math.min(Math.max(0, input.balancedStepsCount), stepsCount);

  const runStraightSteps = Math.max(0, stepsCount - balancedStepsCount);
  const runLengthM = runStraightSteps * input.treadDepthM;

  const landingSizeM = Math.max(input.stairWidthM, 1.0);

  const footprintLengthM = runLengthM + landingSizeM;
  const footprintWidthM = input.stairWidthM + landingSizeM;

  const wasteFactor = 1 + input.wastePercent / 100;
  const concreteVolumeM3 = input.stairWidthM * footprintLengthM * input.slabThicknessM * wasteFactor;

  const undersideM2 = input.stairWidthM * footprintLengthM;
  const sideRisersM2 = 2 * footprintLengthM * input.slabThicknessM;
  const formworkSurfaceM2 = (undersideM2 + sideRisersM2) * 1.15;

  return {
    stepsCount,
    riserHeightM: round2(riserHeightM),
    balancedStepsCount,
    footprintLengthM: round2(footprintLengthM),
    footprintWidthM: round2(footprintWidthM),
    concreteVolumeM3: round2(concreteVolumeM3),
    formworkSurfaceM2: round2(formworkSurfaceM2),
  };
}
