import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";

export default function FormworkCalculatorPage() {
  return (
    <FeatureGate featureKey="formwork">
      <CalculatorPageShell
        title="Calculateur coffrage"
        description="Surfaces de coffrage estimatives pour optimiser vos quantités et votre temps."
      >
        <div className="text-sm text-white/60">Calculateur en cours d’implémentation.</div>
      </CalculatorPageShell>
    </FeatureGate>
  );
}
