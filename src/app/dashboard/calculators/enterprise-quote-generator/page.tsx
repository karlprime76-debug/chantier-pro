import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { EnterpriseQuoteGenerator } from "@/components/calculators/EnterpriseQuoteGenerator";

export default function EnterpriseQuoteGeneratorPage() {
  return (
    <FeatureGate featureKey="enterprise_quote_generator">
      <CalculatorPageShell
        title="Générateur de devis"
        description="Devis simple avec lignes dynamiques, totaux, remise et marge."
      >
        <EnterpriseQuoteGenerator />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
