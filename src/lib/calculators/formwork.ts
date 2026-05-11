import { z } from "zod";

export const FormworkElementTypeSchema = z.enum(["SLAB", "BEAM", "COLUMN", "WALL"]);

export const FormworkInputSchema = z.object({
  elementType: FormworkElementTypeSchema,
  lengthM: z.number().positive(),
  widthM: z.number().positive(),
  heightM: z.number().positive(),
  thicknessM: z.number().min(0),
  quantity: z.number().int().min(1),
  panelAreaM2: z.number().positive(),
  wastePercent: z.number().min(0),
  pricePerM2: z.number().positive().optional(),
});

export type FormworkInput = z.infer<typeof FormworkInputSchema>;

export type FormworkOutput = {
  formworkSurfaceM2: number;
  formworkSurfaceWithWasteM2: number;
  panelsCount: number;
  propsEstimate: number;
  estimatedCost: number | null;
};

function round(value: number, digits: number) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

function surfaceForOne(input: FormworkInput): number {
  switch (input.elementType) {
    case "SLAB": {
      // Sous-face dalle + rives (périmètre * épaisseur)
      const underside = input.lengthM * input.widthM;
      const perimeter = 2 * (input.lengthM + input.widthM);
      const edges = perimeter * input.thicknessM;
      return underside + edges;
    }
    case "BEAM": {
      // 2 flancs + sous-face
      return (2 * input.heightM + input.widthM) * input.lengthM;
    }
    case "COLUMN": {
      // 4 faces
      return 2 * (input.widthM + input.thicknessM) * input.heightM;
    }
    case "WALL": {
      // 2 faces
      return 2 * input.lengthM * input.heightM;
    }
  }
}

export function computeFormwork(input: FormworkInput): FormworkOutput {
  const parsed = FormworkInputSchema.parse(input);

  const one = surfaceForOne(parsed);
  const formworkSurfaceM2 = one * parsed.quantity;
  const formworkSurfaceWithWasteM2 = formworkSurfaceM2 * (1 + parsed.wastePercent / 100);

  const panelsCount = Math.max(0, Math.ceil(formworkSurfaceWithWasteM2 / parsed.panelAreaM2));

  // Étaiement simple: ordre de grandeur ~ 1 étai / 1.5 m²
  const propsEstimate = Math.max(0, Math.ceil(formworkSurfaceWithWasteM2 / 1.5));

  const estimatedCost = parsed.pricePerM2 ? formworkSurfaceWithWasteM2 * parsed.pricePerM2 : null;

  return {
    formworkSurfaceM2: round(formworkSurfaceM2, 3),
    formworkSurfaceWithWasteM2: round(formworkSurfaceWithWasteM2, 3),
    panelsCount,
    propsEstimate,
    estimatedCost: estimatedCost !== null ? round(estimatedCost, 0) : null,
  };
}
