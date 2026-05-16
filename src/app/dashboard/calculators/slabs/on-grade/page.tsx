import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { SlabOnGradeCalculator } from "@/components/calculators/SlabOnGradeCalculator";

export default function SlabOnGradeCalculatorPage() {
  return (
    <FeatureGate featureKey="slab_on_grade">
      <CalculatorPageShell
        title="Dalle sur terre-plein"
        description="Estimation : béton, couche de forme, sable, polyane et treillis."
      >
        <SlabOnGradeCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
