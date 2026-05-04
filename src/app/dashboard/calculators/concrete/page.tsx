import { FeatureGate } from "@/components/subscription/FeatureGate";
import { ConcreteCalculator } from "@/components/calculators/ConcreteCalculator";

export default function ConcreteCalculatorPage() {
  return (
    <FeatureGate featureKey="concrete_basic">
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Calculateur béton</h1>
          <p className="mt-1 text-sm text-white/60">Volume + marge de perte + estimation matériaux.</p>
        </div>

        <ConcreteCalculator />
      </div>
    </FeatureGate>
  );
}
