import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { FeatureGate } from "@/components/subscription/FeatureGate";

export default function ConcreteCalculatorPage() {
  return (
    <FeatureGate featureKey="concrete_basic">
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Calculateur béton</h1>
          <p className="mt-1 text-sm text-white/60">Volume + marge de perte + estimation matériaux.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Paramètres</CardTitle>
            <CardDescription>Dalle, poteau, poutre, semelles, longrines.</CardDescription>
          </CardHeader>

          <form className="grid gap-4">
            <Input label="Type d'élément" name="elementType" placeholder="Ex: dalle" />
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Longueur (m)" name="length" placeholder="Ex: 6" />
              <Input label="Largeur (m)" name="width" placeholder="Ex: 4" />
              <Input label="Hauteur/épaisseur (m)" name="height" placeholder="Ex: 0.12" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Quantité" name="quantity" placeholder="Ex: 1" />
              <Input label="Marge de perte (%)" name="wasteMargin" placeholder="Ex: 8" />
            </div>

            <div className="grid gap-2 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-sm font-bold text-white">Résultats (placeholder)</div>
              <div className="text-sm text-white/60">Volume total: — m³</div>
              <div className="text-sm text-white/60">Volume avec perte: — m³</div>
              <div className="text-sm text-white/60">Ciment / sable / gravier: —</div>
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
