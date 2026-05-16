import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { LabCompactionDegreeCalculator } from "@/components/calculators/LabCompactionDegreeCalculator";

export default function LabCompactionDegreeCalculatorPage() {
  return (
    <FeatureGate featureKey="lab_compaction_degree">
      <CalculatorPageShell
        title="Degré de compactage"
        description="Aide labo : % compactage (ρd / ρd,max) + seuil."
      >
        <LabCompactionDegreeCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
