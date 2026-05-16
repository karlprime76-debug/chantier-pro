import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { LabAggregateMoistureCalculator } from "@/components/calculators/LabAggregateMoistureCalculator";

export default function LabAggregateMoistureCalculatorPage() {
  return (
    <FeatureGate featureKey="lab_aggregate_moisture">
      <CalculatorPageShell
        title="Teneur en eau (granulats)"
        description="Aide labo : humidité (%) à partir de masses humide/sèche."
      >
        <LabAggregateMoistureCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
