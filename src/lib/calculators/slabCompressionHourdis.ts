import { z } from "zod";

export const SlabCompressionHourdisInputSchema = z.object({
  lengthM: z.number().finite().positive(),
  widthM: z.number().finite().positive(),
  compressionThicknessM: z.number().finite().positive(),
  joistSpacingM: z.number().finite().positive(),
  hourdisLengthM: z.number().finite().positive().default(0.5),
  hourdisWidthM: z.number().finite().positive().default(0.2),
  wastePercent: z.number().finite().min(0).max(50).default(8),
});

export type SlabCompressionHourdisInput = z.infer<typeof SlabCompressionHourdisInputSchema>;

export type SlabCompressionHourdisOutput = {
  areaM2: number;
  concreteVolumeM3: number;
  concreteVolumeWithWasteM3: number;
  joistsCount: number;
  joistsTotalLengthM: number;
  hourdisCount: number;
  meshAreaM2: number;
};

function round(value: number, digits = 2) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

export function computeSlabCompressionHourdis(input: SlabCompressionHourdisInput): SlabCompressionHourdisOutput {
  const p = SlabCompressionHourdisInputSchema.parse(input);

  const areaM2 = p.lengthM * p.widthM;
  const wasteFactor = 1 + p.wastePercent / 100;

  const concreteVolumeM3 = areaM2 * p.compressionThicknessM;
  const concreteVolumeWithWasteM3 = concreteVolumeM3 * wasteFactor;

  const joistsCount = Math.max(1, Math.floor(p.widthM / p.joistSpacingM) + 1);
  const joistsTotalLengthM = joistsCount * p.lengthM;

  const hourdisAreaM2 = p.hourdisLengthM * p.hourdisWidthM;
  const hourdisCount = hourdisAreaM2 > 0 ? Math.ceil((areaM2 / hourdisAreaM2) * wasteFactor) : 0;

  const meshAreaM2 = areaM2 * wasteFactor;

  return {
    areaM2: round(areaM2, 2),
    concreteVolumeM3: round(concreteVolumeM3, 3),
    concreteVolumeWithWasteM3: round(concreteVolumeWithWasteM3, 3),
    joistsCount,
    joistsTotalLengthM: round(joistsTotalLengthM, 2),
    hourdisCount,
    meshAreaM2: round(meshAreaM2, 2),
  };
}
