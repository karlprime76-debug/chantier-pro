import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";

export default function SepticTankCalculatorPage() {
  return (
    <FeatureGate featureKey="septic_tank">
      <CalculatorPageShell
        title="Calculateur fosse septique / puisard"
        description="Pré-dimensionnement et quantités estimatives selon usage et volume (MVP)."
      >
        <div className="text-sm text-white/60">Calculateur en cours d’implémentation.</div>
      </CalculatorPageShell>
    </FeatureGate>
  );
}
