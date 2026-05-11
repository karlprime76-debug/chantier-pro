import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { QuarterTurnStairCalculator } from "@/components/calculators/QuarterTurnStairCalculator";

export default function QuarterTurnStairCalculatorPage() {
  return (
    <FeatureGate featureKey="stair_quarter_turn">
      <CalculatorPageShell
        title="Calculateur escalier quart tournant"
        description="Pré-dimensionnement et quantités estimatives pour un quart tournant (à venir)."
      >
        <QuarterTurnStairCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
