import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { EarthworkCalculator } from "@/components/calculators/EarthworkCalculator";

export default function EarthworkCalculatorPage() {
  return (
    <FeatureGate featureKey="earthwork">
      <CalculatorPageShell
        title="Calculateur terrassement"
        description="Volumes de déblais/remblais estimatifs selon fouilles, tranchées et plateformes."
      >
        <EarthworkCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
