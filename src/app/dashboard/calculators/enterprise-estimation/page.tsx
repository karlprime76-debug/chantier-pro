import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { EnterpriseEstimationCalculator } from "@/components/calculators/EnterpriseEstimationCalculator";

export default function EnterpriseEstimationPage() {
  return (
    <FeatureGate featureKey="enterprise_estimation">
      <CalculatorPageShell
        title="Estimation complète d’un ouvrage"
        description="Estimation globale (matériaux, main-d’œuvre, autres frais, marge) + coût au m²."
      >
        <EnterpriseEstimationCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
