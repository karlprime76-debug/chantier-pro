import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { LabAtterbergLimitsCalculator } from "@/components/calculators/LabAtterbergLimitsCalculator";

export default function LabAtterbergLimitsCalculatorPage() {
  return (
    <FeatureGate featureKey="lab_atterberg_limits">
      <CalculatorPageShell
        title="Limites d’Atterberg (IP)"
        description="Aide labo : IP = LL - PL + interprétation indicative."
      >
        <LabAtterbergLimitsCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
