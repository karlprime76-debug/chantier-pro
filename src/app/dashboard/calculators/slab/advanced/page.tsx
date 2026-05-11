import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { AdvancedSlabCalculator } from "@/components/calculators/AdvancedSlabCalculator";

export default function AdvancedSlabCalculatorPage() {
  return (
    <FeatureGate featureKey="advanced_slab">
      <CalculatorPageShell
        title="Calculateur dalle pleine (avancé)"
        description="Estimation avancée dalle pleine : béton, aciers, pertes et variantes (MVP)."
      >
        <AdvancedSlabCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
