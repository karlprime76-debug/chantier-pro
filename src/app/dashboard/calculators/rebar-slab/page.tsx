import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { RebarSlabCalculator } from "@/components/calculators/RebarSlabCalculator";

export default function RebarSlabCalculatorPage() {
  return (
    <FeatureGate featureKey="rebar_slab">
      <CalculatorPageShell
        title="Ferraillage dalle (simple)"
        description="Estimation des barres sens X/Y, recouvrements et poids total."
      >
        <RebarSlabCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
