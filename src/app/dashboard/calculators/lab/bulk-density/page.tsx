import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { LabBulkDensityCalculator } from "@/components/calculators/LabBulkDensityCalculator";

export default function LabBulkDensityCalculatorPage() {
  return (
    <FeatureGate featureKey="lab_bulk_density">
      <CalculatorPageShell
        title="Masse volumique apparente"
        description="Aide labo : kg/m³ à partir de masse et volume."
      >
        <LabBulkDensityCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
