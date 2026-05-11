import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { PlasterCalculator } from "@/components/calculators/PlasterCalculator";

export default function PlasterCalculatorPage() {
  return (
    <FeatureGate featureKey="plaster">
      <CalculatorPageShell
        title="Calculateur enduit"
        description="Estimation des quantités d’enduit, ciment/sable et surfaces à traiter."
      >
        <PlasterCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
