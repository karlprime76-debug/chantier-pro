import { PaintCalculator } from "@/components/calculators/PaintCalculator";

export default function PaintCalculatorPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Peinture</h1>
        <p className="mt-1 text-sm text-white/60">Surfaces, couches, rendement et estimation en litres.</p>
      </div>

      <PaintCalculator />
    </div>
  );
}
