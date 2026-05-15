import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { RebarColumnsCalculator } from "@/components/calculators/RebarColumnsCalculator";

export default function RebarColumnsCalculatorPage() {
  return (
    <FeatureGate featureKey="rebar_columns">
      <CalculatorPageShell
        title="Ferraillage poteaux"
        description="Estimation des aciers longitudinaux et cadres (étriers) pour poteaux."
      >
        <RebarColumnsCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
