import { z } from "zod";

export const ConcreteTrucksInputSchema = z.object({
  volumeTotalM3: z.number().positive(),
  truckCapacityM3: z.number().positive(),
  wastePercent: z.number().min(0),
});

export type ConcreteTrucksInput = z.infer<typeof ConcreteTrucksInputSchema>;

export type ConcreteTrucksOutput = {
  volumeWithWasteM3: number;
  trucksCount: number;
  deliveredVolumeM3: number;
  remainingM3: number;
};

function round(value: number, digits: number) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

export function computeConcreteTrucks(input: ConcreteTrucksInput): ConcreteTrucksOutput {
  const parsed = ConcreteTrucksInputSchema.parse(input);

  const volumeWithWasteM3 = parsed.volumeTotalM3 * (1 + parsed.wastePercent / 100);
  const trucksCount = Math.max(1, Math.ceil(volumeWithWasteM3 / parsed.truckCapacityM3));
  const deliveredVolumeM3 = trucksCount * parsed.truckCapacityM3;
  const remainingM3 = deliveredVolumeM3 - volumeWithWasteM3;

  return {
    volumeWithWasteM3: round(volumeWithWasteM3, 3),
    trucksCount,
    deliveredVolumeM3: round(deliveredVolumeM3, 3),
    remainingM3: round(remainingM3, 3),
  };
}
