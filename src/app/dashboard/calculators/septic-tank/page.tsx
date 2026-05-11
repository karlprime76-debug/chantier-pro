import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { SepticTankCalculator } from "@/components/calculators/SepticTankCalculator";

export default function SepticTankCalculatorPage() {
  return (
    <FeatureGate featureKey="septic_tank">
      <CalculatorPageShell
        title="Calculateur fosse septique / puisard"
        description="Pré-dimensionnement et quantités estimatives selon usage et volume (MVP)."
      >
        <SepticTankCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
