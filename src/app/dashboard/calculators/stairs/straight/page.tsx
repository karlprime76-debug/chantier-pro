import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { StraightStairCalculator } from "@/components/calculators/StraightStairCalculator";

export default function StraightStairCalculatorPage() {
  return (
    <FeatureGate featureKey="stair_straight">
      <CalculatorPageShell
        title="Calculateur escalier droit"
        description="Dimensions principales, confort et quantités béton/coffrage estimatives."
      >
        <StraightStairCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
