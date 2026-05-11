import { z } from "zod";

export const LandingStairInputSchema = z.object({
  totalHeightM: z.number().positive(),
  targetRiserHeightM: z.number().positive(),
  treadDepthM: z.number().positive(),
  stairWidthM: z.number().positive(),
  landingLengthM: z.number().positive(),
  slabThicknessM: z.number().positive(),
  wastePercent: z.number().min(0),
});

export type LandingStairInput = z.infer<typeof LandingStairInputSchema>;

export type LandingStairOutput = {
  stepsCount: number;
  riserHeightM: number;
  runLengthM: number;
  concreteVolumeM3: number;
  formworkSurfaceM2: number;
};

function round(value: number, digits: number) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

export function computeLandingStair(input: LandingStairInput): LandingStairOutput {
  const parsed = LandingStairInputSchema.parse(input);

  const stepsCount = Math.max(1, Math.round(parsed.totalHeightM / parsed.targetRiserHeightM));
  const riserHeightM = parsed.totalHeightM / stepsCount;

  const runLengthM = stepsCount * parsed.treadDepthM + parsed.landingLengthM;

  // Volume béton: approximation "dalle" (sous-face) -> largeur * longueur développée * épaisseur
  const volumeBaseM3 = parsed.stairWidthM * runLengthM * parsed.slabThicknessM;
  const concreteVolumeM3 = volumeBaseM3 * (1 + parsed.wastePercent / 100);

  // Coffrage: sous-face (approx) + rives légères
  const underside = parsed.stairWidthM * runLengthM;
  const edges = 2 * runLengthM * parsed.slabThicknessM;
  const formworkSurfaceM2 = (underside + edges) * (1 + parsed.wastePercent / 100);

  return {
    stepsCount,
    riserHeightM: round(riserHeightM, 3),
    runLengthM: round(runLengthM, 3),
    concreteVolumeM3: round(concreteVolumeM3, 3),
    formworkSurfaceM2: round(formworkSurfaceM2, 3),
  };
}
