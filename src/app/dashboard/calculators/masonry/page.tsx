import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";

export default function MasonryCalculatorPage() {
  return (
    <FeatureGate featureKey="masonry">
      <CalculatorPageShell
        title="Calculateur maçonnerie"
        description="Estimation blocs, mortier et surfaces selon vos murs et ouvertures."
      >
        <div className="text-sm text-white/60">Calculateur en cours d’implémentation.</div>
      </CalculatorPageShell>
    </FeatureGate>
  );
}
