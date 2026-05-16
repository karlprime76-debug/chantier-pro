import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { LabCompressiveStrengthCalculator } from "@/components/calculators/LabCompressiveStrengthCalculator";

export default function LabCompressiveStrengthCalculatorPage() {
  return (
    <FeatureGate featureKey="lab_compressive_strength">
      <CalculatorPageShell
        title="Résistance moyenne à la compression"
        description="Aide labo : moyenne, min/max, dispersion (MPa)."
      >
        <LabCompressiveStrengthCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
