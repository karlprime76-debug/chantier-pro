import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { LabSieveAnalysisCalculator } from "@/components/calculators/LabSieveAnalysisCalculator";

export default function LabSieveAnalysisCalculatorPage() {
  return (
    <FeatureGate featureKey="lab_sieve_analysis">
      <CalculatorPageShell
        title="Analyse granulométrique (tamis)"
        description="Aide labo : tableau % retenu / passant cumulé."
      >
        <LabSieveAnalysisCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
