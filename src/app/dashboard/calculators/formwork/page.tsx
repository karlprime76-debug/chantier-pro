import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { FormworkCalculator } from "@/components/calculators/FormworkCalculator";

export default function FormworkCalculatorPage() {
  return (
    <FeatureGate featureKey="formwork">
      <CalculatorPageShell
        title="Calculateur coffrage"
        description="Surfaces de coffrage estimatives pour optimiser vos quantités et votre temps."
      >
        <FormworkCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
