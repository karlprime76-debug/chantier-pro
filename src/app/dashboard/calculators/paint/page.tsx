import { PaintCalculator } from "@/components/calculators/PaintCalculator";
import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";

export default function PaintCalculatorPage() {
  return (
    <FeatureGate featureKey="concrete_basic">
      <CalculatorPageShell
        title="Peinture"
        description="Surfaces, couches, rendement et estimation en litres."
      >
        <PaintCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
