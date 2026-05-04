import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";

export default function PlasterCalculatorPage() {
  return (
    <FeatureGate featureKey="plaster">
      <CalculatorPageShell
        title="Calculateur enduit"
        description="Estimation des quantités d’enduit, ciment/sable et surfaces à traiter."
      >
        <div className="text-sm text-white/60">Calculateur en cours d’implémentation.</div>
      </CalculatorPageShell>
    </FeatureGate>
  );
}
