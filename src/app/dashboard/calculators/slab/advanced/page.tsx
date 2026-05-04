import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";

export default function AdvancedSlabCalculatorPage() {
  return (
    <FeatureGate featureKey="advanced_slab">
      <CalculatorPageShell
        title="Calculateur dalle pleine (avancé)"
        description="Estimation avancée dalle pleine : béton, aciers, pertes et variantes (MVP)."
      >
        <div className="text-sm text-white/60">Calculateur en cours d’implémentation.</div>
      </CalculatorPageShell>
    </FeatureGate>
  );
}
