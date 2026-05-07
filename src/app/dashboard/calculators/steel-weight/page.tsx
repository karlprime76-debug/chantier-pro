import { SteelWeightCalculator } from "@/components/calculators/SteelWeightCalculator";

export default function SteelWeightCalculatorPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Poids acier</h1>
        <p className="mt-1 text-sm text-white/60">Poids total selon diamètre et longueur.</p>
      </div>

      <SteelWeightCalculator />
    </div>
  );
}
