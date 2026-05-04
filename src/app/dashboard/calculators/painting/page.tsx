import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";

export default function PaintingCalculatorPage() {
  return (
    <FeatureGate featureKey="painting">
      <CalculatorPageShell
        title="Calculateur peinture"
        description="Estimation litres, couches et surfaces selon supports et rendement."
      >
        <div className="text-sm text-white/60">Calculateur en cours d’implémentation.</div>
      </CalculatorPageShell>
    </FeatureGate>
  );
}
