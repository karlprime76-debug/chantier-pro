import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { RebarBeamsCalculator } from "@/components/calculators/RebarBeamsCalculator";

export default function RebarBeamsCalculatorPage() {
  return (
    <FeatureGate featureKey="rebar_beams">
      <CalculatorPageShell
        title="Ferraillage poutres"
        description="Estimation des barres haut/bas et étriers pour poutres."
      >
        <RebarBeamsCalculator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
