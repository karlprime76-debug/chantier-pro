import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { LabDryDensityCalculator } from "@/components/calculators/LabDryDensityCalculator";

export default function LabDryDensityCalculatorPage() {
  return (
    <FeatureGate featureKey="lab_dry_density">
      <CalculatorPageShell
        title="Densité humide / densité sèche"
        description="Aide labo : calcul de la densité sèche à partir de la densité humide et de w%."
      >
        <LabDryDensityCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
