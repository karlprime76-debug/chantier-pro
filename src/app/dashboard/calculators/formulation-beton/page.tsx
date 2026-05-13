import { FeatureGate } from "@/components/subscription/FeatureGate";
import { ConcreteMixDesignCalculator } from "@/components/calculators/ConcreteMixDesignCalculator";

export default function ConcreteMixDesignCalculatorPage() {
  return (
    <FeatureGate featureKey="concrete_mix_design">
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--app-text)]">Formulation de béton</h1>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">
            Dosage indicatif : ciment, eau, sable, gravier, adjuvant et corrections d’humidité.
          </p>
        </div>

        <ConcreteMixDesignCalculator />
      </div>
    </FeatureGate>
  );
}
