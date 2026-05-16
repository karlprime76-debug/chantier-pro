import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { LabCbrSimplifiedCalculator } from "@/components/calculators/LabCbrSimplifiedCalculator";

export default function LabCbrSimplifiedCalculatorPage() {
  return (
    <FeatureGate featureKey="lab_cbr_simplified">
      <CalculatorPageShell
        title="CBR simplifié"
        description="Aide labo : CBR 2,5 / 5 et CBR retenu."
      >
        <LabCbrSimplifiedCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
