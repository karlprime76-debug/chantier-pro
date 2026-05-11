import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { AdvancedMasonryCalculator } from "@/components/calculators/AdvancedMasonryCalculator";

export default function MasonryCalculatorPage() {
  return (
    <FeatureGate featureKey="masonry">
      <CalculatorPageShell
        title="Calculateur maçonnerie"
        description="Estimation blocs, mortier et surfaces selon vos murs et ouvertures."
      >
        <AdvancedMasonryCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
