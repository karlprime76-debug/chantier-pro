import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { EnterprisePriceLibrary } from "@/components/calculators/EnterprisePriceLibrary";

export default function EnterprisePriceLibraryPage() {
  return (
    <FeatureGate featureKey="enterprise_price_library">
      <CalculatorPageShell
        title="Bibliothèque de prix"
        description="Ajoute des prix unitaires, quantités optionnelles, et totalise tes lignes."
      >
        <EnterprisePriceLibrary />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
