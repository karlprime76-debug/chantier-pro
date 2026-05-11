import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { CalculationsPrintClient } from "@/components/calculations/CalculationsPrintClient";

export default function CalculationsPrintPage() {
  return (
    <FeatureGate featureKey="calc_pdf">
      <CalculatorPageShell title="Export PDF calcul" description="MVP: page imprimable + Enregistrer en PDF.">
        <CalculationsPrintClient />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
