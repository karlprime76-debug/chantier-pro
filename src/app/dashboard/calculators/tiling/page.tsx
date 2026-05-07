import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { TilingSimpleCalculator } from "@/components/calculators/TilingSimpleCalculator";

export default function TilingCalculatorPage() {
  return (
    <FeatureGate featureKey="tiling">
      <CalculatorPageShell
        title="Calculateur carrelage"
        description="Estimation carrelage, colle, joints et chutes selon vos surfaces."
      >
        <TilingSimpleCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
