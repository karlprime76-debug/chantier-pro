import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";

export default function FenceCalculatorPage() {
  return (
    <FeatureGate featureKey="fence">
      <CalculatorPageShell
        title="Calculateur clôture"
        description="Estimation poteaux, linéaire, fondations et consommables (MVP)."
      >
        <div className="text-sm text-white/60">Calculateur en cours d’implémentation.</div>
      </CalculatorPageShell>
    </FeatureGate>
  );
}
