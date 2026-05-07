import { MasonryBlocksCalculator } from "@/components/calculators/MasonryBlocksCalculator";

export default function MasonryBlocksCalculatorPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Agglos / Briques</h1>
        <p className="mt-1 text-sm text-white/60">Surface de mur + nombre de blocs + marge de perte.</p>
      </div>

      <MasonryBlocksCalculator />
    </div>
  );
}
