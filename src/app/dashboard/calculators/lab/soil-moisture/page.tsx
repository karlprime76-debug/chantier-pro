import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { LabSoilMoistureCalculator } from "@/components/calculators/LabSoilMoistureCalculator";

export default function LabSoilMoistureCalculatorPage() {
  return (
    <FeatureGate featureKey="lab_soil_moisture">
      <CalculatorPageShell
        title="Teneur en eau du sol"
        description="Aide labo : humidité (%) à partir de masses humide/sèche."
      >
        <LabSoilMoistureCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
