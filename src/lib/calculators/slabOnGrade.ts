import { z } from "zod";

export const SlabOnGradeInputSchema = z.object({
  lengthM: z.number().finite().positive(),
  widthM: z.number().finite().positive(),
  concreteThicknessM: z.number().finite().positive(),
  subbaseThicknessM: z.number().finite().min(0),
  sandThicknessM: z.number().finite().min(0),
  hasPolyane: z.boolean().default(true),
  hasWeldedMesh: z.boolean().default(true),
  wastePercent: z.number().finite().min(0).max(50).default(8),
});

export type SlabOnGradeInput = z.infer<typeof SlabOnGradeInputSchema>;

export type SlabOnGradeOutput = {
  areaM2: number;
  concreteVolumeM3: number;
  concreteVolumeWithWasteM3: number;
  subbaseVolumeM3: number;
  sandVolumeM3: number;
  polyaneAreaM2: number | null;
  weldedMeshAreaM2: number | null;
};

function round(value: number, digits = 2) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

export function computeSlabOnGrade(input: SlabOnGradeInput): SlabOnGradeOutput {
  const p = SlabOnGradeInputSchema.parse(input);

  const areaM2 = p.lengthM * p.widthM;
  const wasteFactor = 1 + p.wastePercent / 100;

  const concreteVolumeM3 = areaM2 * p.concreteThicknessM;
  const concreteVolumeWithWasteM3 = concreteVolumeM3 * wasteFactor;

  const subbaseVolumeM3 = areaM2 * p.subbaseThicknessM;
  const sandVolumeM3 = areaM2 * p.sandThicknessM;

  const polyaneAreaM2 = p.hasPolyane ? areaM2 * 1.1 : null;
  const weldedMeshAreaM2 = p.hasWeldedMesh ? areaM2 : null;

  return {
    areaM2: round(areaM2, 2),
    concreteVolumeM3: round(concreteVolumeM3, 3),
    concreteVolumeWithWasteM3: round(concreteVolumeWithWasteM3, 3),
    subbaseVolumeM3: round(subbaseVolumeM3, 3),
    sandVolumeM3: round(sandVolumeM3, 3),
    polyaneAreaM2: polyaneAreaM2 !== null ? round(polyaneAreaM2, 2) : null,
    weldedMeshAreaM2: weldedMeshAreaM2 !== null ? round(weldedMeshAreaM2, 2) : null,
  };
}
