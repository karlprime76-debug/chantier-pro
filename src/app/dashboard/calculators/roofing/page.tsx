import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { RoofingCalculator } from "@/components/calculators/RoofingCalculator";

export default function RoofingCalculatorPage() {
  return (
    <FeatureGate featureKey="roofing">
      <CalculatorPageShell
        title="Calculateur toiture"
        description="Estimation des surfaces, pentes et quantités selon la couverture."
      >
        <RoofingCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
