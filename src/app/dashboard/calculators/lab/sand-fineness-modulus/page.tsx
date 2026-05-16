import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { LabSandFinenessModulusCalculator } from "@/components/calculators/LabSandFinenessModulusCalculator";

export default function LabSandFinenessModulusCalculatorPage() {
  return (
    <FeatureGate featureKey="lab_sand_fineness_modulus">
      <CalculatorPageShell
        title="Module de finesse du sable"
        description="Aide labo : MF + interprétation indicative."
      >
        <LabSandFinenessModulusCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
