import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";

export default function QuarterTurnStairCalculatorPage() {
  return (
    <FeatureGate featureKey="stair_quarter_turn">
      <CalculatorPageShell
        title="Calculateur escalier quart tournant"
        description="Pré-dimensionnement et quantités estimatives pour un quart tournant (à venir)."
      >
        <div className="text-sm text-white/60">Module planifié. Implémentation plus tard.</div>
      </CalculatorPageShell>
    </FeatureGate>
  );
}
