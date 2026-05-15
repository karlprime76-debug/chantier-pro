import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { ConcreteTrucksCalculator } from "@/components/calculators/ConcreteTrucksCalculator";

export default function ConcreteTrucksCalculatorPage() {
  return (
    <FeatureGate featureKey="concrete_trucks">
      <CalculatorPageShell
        title="Nombre de toupies béton"
        description="Estime le nombre de toupies nécessaires selon le volume, la capacité et la perte."
      >
        <ConcreteTrucksCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
