import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";

export default function RoofingCalculatorPage() {
  return (
    <FeatureGate featureKey="roofing">
      <CalculatorPageShell
        title="Calculateur toiture"
        description="Estimation des surfaces, pentes et quantités selon la couverture."
      >
        <div className="text-sm text-white/60">Calculateur en cours d’implémentation.</div>
      </CalculatorPageShell>
    </FeatureGate>
  );
}
