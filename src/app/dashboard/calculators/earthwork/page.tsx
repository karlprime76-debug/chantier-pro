import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";

export default function EarthworkCalculatorPage() {
  return (
    <FeatureGate featureKey="earthwork">
      <CalculatorPageShell
        title="Calculateur terrassement"
        description="Volumes de déblais/remblais estimatifs selon fouilles, tranchées et plateformes."
      >
        <div className="text-sm text-white/60">Calculateur en cours d’implémentation.</div>
      </CalculatorPageShell>
    </FeatureGate>
  );
}
