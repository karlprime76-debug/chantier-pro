import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { LabSlumpAbramsCalculator } from "@/components/calculators/LabSlumpAbramsCalculator";

export default function LabSlumpAbramsCalculatorPage() {
  return (
    <FeatureGate featureKey="lab_slump_abram">
      <CalculatorPageShell
        title="Affaissement au cône d’Abrams"
        description="Aide labo : affaissement (mm) + interprétation indicative."
      >
        <LabSlumpAbramsCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
