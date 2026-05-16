import { z } from "zod";

export const PlancherPoutrellesHourdisInputSchema = z.object({
  lengthM: z.number().finite().positive(),
  widthM: z.number().finite().positive(),
  joistSpacingM: z.number().finite().positive(),
  hourdisLengthM: z.number().finite().positive().default(0.5),
  hourdisWidthM: z.number().finite().positive().default(0.2),
  compressionThicknessM: z.number().finite().positive().default(0.05),
  wastePercent: z.number().finite().min(0).max(50).default(8),
});

export type PlancherPoutrellesHourdisInput = z.infer<typeof PlancherPoutrellesHourdisInputSchema>;

export type PlancherPoutrellesHourdisOutput = {
  areaM2: number;
  joistsCount: number;
  joistsTotalLengthM: number;
  hourdisCount: number;
  compressionConcreteM3: number;
  compressionConcreteWithWasteM3: number;
};

function round(value: number, digits = 2) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

export function computePlancherPoutrellesHourdis(input: PlancherPoutrellesHourdisInput): PlancherPoutrellesHourdisOutput {
  const p = PlancherPoutrellesHourdisInputSchema.parse(input);

  const areaM2 = p.lengthM * p.widthM;
  const wasteFactor = 1 + p.wastePercent / 100;

  const joistsCount = Math.max(1, Math.floor(p.widthM / p.joistSpacingM) + 1);
  const joistsTotalLengthM = joistsCount * p.lengthM;

  const hourdisAreaM2 = p.hourdisLengthM * p.hourdisWidthM;
  const hourdisCount = hourdisAreaM2 > 0 ? Math.ceil((areaM2 / hourdisAreaM2) * wasteFactor) : 0;

  const compressionConcreteM3 = areaM2 * p.compressionThicknessM;
  const compressionConcreteWithWasteM3 = compressionConcreteM3 * wasteFactor;

  return {
    areaM2: round(areaM2, 2),
    joistsCount,
    joistsTotalLengthM: round(joistsTotalLengthM, 2),
    hourdisCount,
    compressionConcreteM3: round(compressionConcreteM3, 3),
    compressionConcreteWithWasteM3: round(compressionConcreteWithWasteM3, 3),
  };
}
