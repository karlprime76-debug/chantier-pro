import { z } from "zod";

export const StairStraightInputSchema = z.object({
  totalHeightCm: z.number().positive(),
  availableLengthCm: z.number().positive(),
  stairWidthCm: z.number().positive(),
  slabThicknessCm: z.number().positive(),
  concreteDosageKgM3: z.number().positive(),
  wasteMarginPercent: z.number().min(0),
  stepsMode: z.enum(["auto", "manual"]),
  stepsCount: z.number().int().min(2).optional(),
  pricePerM3: z.number().positive().optional(),
});

export type StairStraightInput = z.infer<typeof StairStraightInputSchema>;

export type StairStraightOutput = {
  stepsCount: number;
  riserHeightCm: number;
  goingCm: number;
  comfortValueCm: number;
  comfortStatus: "confortable" | "acceptable" | "trop_raid" | "giron_insuffisant" | "hauteur_excessive";
  slabLengthM: number;
  concreteVolumeM3: number;
  concreteVolumeWithWasteM3: number;
  formworkAreaM2: number;
  cementEstimateKg: number;
  sandEstimateM3: number;
  gravelEstimateM3: number;
  estimatedCost: number | null;
};

function round(value: number, digits: number) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

function computeComfortStatus(riserHeightCm: number, goingCm: number, comfortValueCm: number) {
  if (goingCm < 22) return "giron_insuffisant" as const;
  if (riserHeightCm > 19) return "hauteur_excessive" as const;
  if (comfortValueCm >= 60 && comfortValueCm <= 64) return "confortable" as const;
  if (comfortValueCm >= 58 && comfortValueCm <= 66) return "acceptable" as const;
  return "trop_raid" as const;
}

export function computeStraightStair(input: StairStraightInput): StairStraightOutput {
  const parsed = StairStraightInputSchema.parse(input);

  const stepsCount =
    parsed.stepsMode === "manual" && parsed.stepsCount ? parsed.stepsCount : Math.round(parsed.totalHeightCm / 17);

  const safeStepsCount = Math.max(2, stepsCount);

  const riserHeightCm = parsed.totalHeightCm / safeStepsCount;
  const goingsCount = Math.max(1, safeStepsCount - 1);
  const goingCm = parsed.availableLengthCm / goingsCount;

  const comfortValueCm = 2 * riserHeightCm + goingCm;
  const comfortStatus = computeComfortStatus(riserHeightCm, goingCm, comfortValueCm);

  const heightM = parsed.totalHeightCm / 100;
  const lengthM = parsed.availableLengthCm / 100;
  const widthM = parsed.stairWidthCm / 100;
  const thicknessM = parsed.slabThicknessCm / 100;

  const slabLengthM = Math.sqrt(heightM ** 2 + lengthM ** 2);
  const concreteVolumeM3 = slabLengthM * widthM * thicknessM;
  const concreteVolumeWithWasteM3 = concreteVolumeM3 * (1 + parsed.wasteMarginPercent / 100);

  const formworkAreaM2 = slabLengthM * widthM;

  const cementEstimateKg = concreteVolumeWithWasteM3 * parsed.concreteDosageKgM3;

  const sandEstimateM3 = concreteVolumeWithWasteM3 * 0.5;
  const gravelEstimateM3 = concreteVolumeWithWasteM3 * 0.8;

  const estimatedCost = parsed.pricePerM3 ? concreteVolumeWithWasteM3 * parsed.pricePerM3 : null;

  return {
    stepsCount: safeStepsCount,
    riserHeightCm: round(riserHeightCm, 1),
    goingCm: round(goingCm, 1),
    comfortValueCm: round(comfortValueCm, 1),
    comfortStatus,
    slabLengthM: round(slabLengthM, 3),
    concreteVolumeM3: round(concreteVolumeM3, 3),
    concreteVolumeWithWasteM3: round(concreteVolumeWithWasteM3, 3),
    formworkAreaM2: round(formworkAreaM2, 2),
    cementEstimateKg: round(cementEstimateKg, 0),
    sandEstimateM3: round(sandEstimateM3, 3),
    gravelEstimateM3: round(gravelEstimateM3, 3),
    estimatedCost: estimatedCost ? round(estimatedCost, 0) : null,
  };
}
