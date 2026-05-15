import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";

export default function EnterpriseSmartReportPage() {
  return (
    <FeatureGate featureKey="enterprise_smart_report">
      <CalculatorPageShell
        title="Rapport chantier intelligent"
        description="Disponible prochainement pour les comptes Entreprise."
      >
        <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
          Module avancé en préparation.
        </div>
      </CalculatorPageShell>
    </FeatureGate>
  );
}
