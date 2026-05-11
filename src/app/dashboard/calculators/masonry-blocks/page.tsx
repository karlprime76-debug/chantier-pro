import { MasonryBlocksCalculator } from "@/components/calculators/MasonryBlocksCalculator";
import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";

export default function MasonryBlocksCalculatorPage() {
  return (
    <FeatureGate featureKey="concrete_basic">
      <CalculatorPageShell
        title="Agglos / Briques"
        description="Surface de mur + nombre de blocs + marge de perte."
      >
        <MasonryBlocksCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
