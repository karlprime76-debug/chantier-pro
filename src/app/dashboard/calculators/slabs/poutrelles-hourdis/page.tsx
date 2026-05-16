import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { PlancherPoutrellesHourdisCalculator } from "@/components/calculators/PlancherPoutrellesHourdisCalculator";

export default function PlancherPoutrellesHourdisCalculatorPage() {
  return (
    <FeatureGate featureKey="plancher_poutrelles_hourdis">
      <CalculatorPageShell
        title="Plancher poutrelles-hourdis"
        description="Estimation : poutrelles, hourdis et béton de compression (pertes incluses)."
      >
        <PlancherPoutrellesHourdisCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
