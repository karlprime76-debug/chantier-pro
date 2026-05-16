import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { LabPressToMpaCalculator } from "@/components/calculators/LabPressToMpaCalculator";

export default function LabPressToMpaCalculatorPage() {
  return (
    <FeatureGate featureKey="lab_press_to_mpa">
      <CalculatorPageShell
        title="Charge presse → MPa"
        description="Aide labo : conversion kN → MPa selon la section de l’éprouvette."
      >
        <LabPressToMpaCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
