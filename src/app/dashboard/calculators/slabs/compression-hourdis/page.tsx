import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { SlabCompressionHourdisCalculator } from "@/components/calculators/SlabCompressionHourdisCalculator";

export default function SlabCompressionHourdisCalculatorPage() {
  return (
    <FeatureGate featureKey="slab_compression_hourdis">
      <CalculatorPageShell
        title="Dalle de compression sur hourdis"
        description="Estimation : béton de compression, poutrelles, hourdis et treillis."
      >
        <SlabCompressionHourdisCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
