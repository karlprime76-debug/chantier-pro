import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { FenceCalculator } from "@/components/calculators/FenceCalculator";

export default function FenceCalculatorPage() {
  return (
    <FeatureGate featureKey="fence">
      <CalculatorPageShell
        title="Calculateur clôture"
        description="Estimation poteaux, linéaire, fondations et consommables (MVP)."
      >
        <FenceCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
