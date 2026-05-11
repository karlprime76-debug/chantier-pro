import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { LandingStairCalculator } from "@/components/calculators/LandingStairCalculator";

export default function LandingStairCalculatorPage() {
  return (
    <FeatureGate featureKey="stair_landing">
      <CalculatorPageShell
        title="Calculateur escalier avec palier"
        description="Estimation des dimensions et quantités pour un escalier avec palier (MVP)."
      >
        <LandingStairCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
