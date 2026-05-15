import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";

export default function EnterprisePriceLibraryPage() {
  return (
    <FeatureGate featureKey="enterprise_price_library">
      <CalculatorPageShell
        title="Bibliothèque de prix"
        description="Module avancé en préparation. Disponible prochainement pour les comptes Entreprise."
      >
        <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
          Module avancé en préparation.
        </div>
      </CalculatorPageShell>
    </FeatureGate>
  );
}
