import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { CalculationsHistoryClient } from "@/components/calculations/CalculationsHistoryClient";

export default function CalculationsHistoryPage() {
  return (
    <FeatureGate featureKey="calc_history">
      <CalculatorPageShell title="Historique des calculs" description="MVP: historique global des calculs sauvegardés.">
        <CalculationsHistoryClient />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
