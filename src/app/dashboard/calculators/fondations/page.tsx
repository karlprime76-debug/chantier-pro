import { FeatureGate } from "@/components/subscription/FeatureGate";
import { FoundationsCalculator } from "@/components/calculators/FoundationsCalculator";

export default function FoundationsCalculatorPage() {
  return (
    <FeatureGate featureKey="foundations">
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--app-text)]">Calculateurs Fondations</h1>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">
            Quantitatifs chantier (fouilles, propreté, béton, acier, coffrage, remblai, coût estimatif).
          </p>
        </div>

        <FoundationsCalculator />
      </div>
    </FeatureGate>
  );
}
