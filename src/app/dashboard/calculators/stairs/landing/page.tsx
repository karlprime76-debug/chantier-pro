import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";

export default function LandingStairCalculatorPage() {
  return (
    <FeatureGate featureKey="stair_landing">
      <CalculatorPageShell
        title="Calculateur escalier avec palier"
        description="Estimation des dimensions et quantités pour un escalier avec palier (MVP)."
      >
        <div className="text-sm text-white/60">Calculateur en cours d’implémentation.</div>
      </CalculatorPageShell>
    </FeatureGate>
  );
}
