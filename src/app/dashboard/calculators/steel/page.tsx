import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { FeatureGate } from "@/components/subscription/FeatureGate";

export default function SteelCalculatorPage() {
  return (
    <FeatureGate featureKey="steel_basic">
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Calculateur acier</h1>
          <p className="mt-1 text-sm text-white/60">Longueurs + poids + barres 12m + coût estimatif.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Paramètres</CardTitle>
            <CardDescription>Enregistre le calcul ensuite dans un chantier.</CardDescription>
          </CardHeader>

          <form className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Diamètre (mm)" name="diameter" placeholder="Ex: 12" />
              <Input label="Longueur unitaire (m)" name="unitLength" placeholder="Ex: 3.2" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Nombre d'éléments" name="count" placeholder="Ex: 20" />
              <Input label="Recouvrement (m)" name="overlap" placeholder="Ex: 0.4" />
            </div>
            <Input label="Coût estimatif (FCFA)" name="estimatedCost" placeholder="Ex: 85000" />

            <div className="grid gap-2 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-sm font-bold text-white">Résultats (placeholder)</div>
              <div className="text-sm text-white/60">Longueur totale: — m</div>
              <div className="text-sm text-white/60">Poids total: — kg</div>
              <div className="text-sm text-white/60">Barres 12m: —</div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Button type="submit" variant="secondary">
                Calculer
              </Button>
              <Button type="button" variant="ghost">
                Sauvegarder dans un chantier
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </FeatureGate>
  );
}
