import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { AdvancedPaintingCalculator } from "@/components/calculators/AdvancedPaintingCalculator";

export default function PaintingCalculatorPage() {
  return (
    <FeatureGate featureKey="painting">
      <CalculatorPageShell
        title="Calculateur peinture"
        description="Estimation litres, couches et surfaces selon supports et rendement."
      >
        <AdvancedPaintingCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
