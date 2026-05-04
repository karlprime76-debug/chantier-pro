import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";

export default function TilingCalculatorPage() {
  return (
    <FeatureGate featureKey="tiling">
      <CalculatorPageShell
        title="Calculateur carrelage"
        description="Estimation carrelage, colle, joints et chutes selon vos surfaces."
      >
        <div className="text-sm text-white/60">Calculateur en cours d’implémentation.</div>
      </CalculatorPageShell>
    </FeatureGate>
  );
}
