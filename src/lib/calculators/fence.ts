import { z } from "zod";

export const FenceInputSchema = z.object({
  fenceLengthM: z.number().finite().positive(),
  fenceHeightM: z.number().finite().positive(),
  postSpacingM: z.number().finite().positive().default(2.5),

  blockSurfaceM2: z.number().finite().positive().default(0.1),
  wastePercent: z.number().finite().min(0).max(50).default(8),

  postConcreteSectionM: z.number().finite().positive().default(0.25),
  postFoundationDepthM: z.number().finite().positive().default(0.6),

  footingWidthM: z.number().finite().positive().default(0.25),
  footingHeightM: z.number().finite().positive().default(0.2),

  steelKgPerM3: z.number().finite().positive().default(80),

  costPerM2: z.number().finite().positive().optional(),
});

export type FenceInput = z.infer<typeof FenceInputSchema>;

export type FenceOutput = {
  postsCount: number;
  wallSurfaceM2: number;
  blocksCount: number;
  postsConcreteVolumeM3: number;
  footingConcreteVolumeM3: number;
  totalConcreteVolumeM3: number;
  steelEstimateKg: number;
  estimatedCost: number | null;
};

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function safeCeilInt(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.ceil(n));
}

export function computeFence(input: FenceInput): FenceOutput {
  const segments = Math.max(1, safeCeilInt(input.fenceLengthM / input.postSpacingM));
  const postsCount = segments + 1;

  const wallSurfaceM2 = input.fenceLengthM * input.fenceHeightM;
  const blocksCount = safeCeilInt((wallSurfaceM2 / input.blockSurfaceM2) * (1 + input.wastePercent / 100));

  const postVol = input.postConcreteSectionM * input.postConcreteSectionM * input.postFoundationDepthM;
  const postsConcreteVolumeM3 = postsCount * postVol;

  const footingConcreteVolumeM3 = input.fenceLengthM * input.footingWidthM * input.footingHeightM;

  const totalConcreteVolumeM3 = postsConcreteVolumeM3 + footingConcreteVolumeM3;

  const steelEstimateKg = totalConcreteVolumeM3 * input.steelKgPerM3;

  const estimatedCost = input.costPerM2 ? round2(wallSurfaceM2 * input.costPerM2) : null;

  return {
    postsCount,
    wallSurfaceM2: round2(wallSurfaceM2),
    blocksCount,
    postsConcreteVolumeM3: round2(postsConcreteVolumeM3),
    footingConcreteVolumeM3: round2(footingConcreteVolumeM3),
    totalConcreteVolumeM3: round2(totalConcreteVolumeM3),
    steelEstimateKg: round2(steelEstimateKg),
    estimatedCost,
  };
}
