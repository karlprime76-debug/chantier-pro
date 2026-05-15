import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalculatorPageShell } from "@/components/calculators/CalculatorPageShell";
import { EnterpriseSmartReport } from "@/components/calculators/EnterpriseSmartReport";

export default function EnterpriseSmartReportPage() {
  return (
    <FeatureGate featureKey="enterprise_smart_report">
      <CalculatorPageShell
        title="Rapport chantier intelligent"
        description="Génération d’un rapport structuré à partir des informations du jour."
      >
        <EnterpriseSmartReport />
      </CalculatorPageShell>
    </FeatureGate>
  );
}
