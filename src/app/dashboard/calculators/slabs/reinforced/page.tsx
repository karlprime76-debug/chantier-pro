import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { SlabReinforcedCalculator } from "@/components/calculators/SlabReinforcedCalculator";

export default function SlabReinforcedCalculatorPage() {
  return (
    <FeatureGate featureKey="slab_rc">
      <CalculatorPageShell
        title="Dalle pleine en béton armé"
        description="Estimation : surface, béton, ferraillage X/Y et coût indicatif."
      >
        <SlabReinforcedCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
