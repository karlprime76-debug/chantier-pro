import { FeatureGate } from "@/components/subscription/FeatureGate";
import { SteelCalculator } from "@/components/calculators/SteelCalculator";

export default function SteelCalculatorPage() {
  return (
    <FeatureGate featureKey="steel_basic">
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Calculateur acier</h1>
          <p className="mt-1 text-sm text-white/60">Longueurs + poids + barres 12m + coût estimatif.</p>
        </div>

        <SteelCalculator />
      </div>
    </FeatureGate>
  );
}
