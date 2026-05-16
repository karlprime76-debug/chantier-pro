import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { LabFreshDensityCalculator } from "@/components/calculators/LabFreshDensityCalculator";

export default function LabFreshDensityCalculatorPage() {
  return (
    <FeatureGate featureKey="lab_fresh_density">
      <CalculatorPageShell
        title="Masse volumique du béton frais"
        description="Aide labo : calcul kg/m³ à partir de masses et du volume du récipient."
      >
        <LabFreshDensityCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
