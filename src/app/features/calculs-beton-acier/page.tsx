import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function FeatureCalculsBetonAcierPage() {
  return (
    <div className="min-h-full">
      <MarketingHeader />
      <AppShell className="pb-16">
        <div className="mx-auto w-full max-w-3xl">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--app-text)]">Calculs béton & acier</h1>
            <p className="mt-2 text-sm text-[var(--app-text-muted)]">
              Calcule rapidement tes quantités sur mobile, garde une trace, et réutilise tes calculs sur chantier.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Un calcul en quelques minutes</CardTitle>
                <CardDescription>Interfaces simples, valeurs claires, saisie rapide sur téléphone.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Moins d’erreurs de quantité</CardTitle>
                <CardDescription>Réduit les oublis et les approximations quand tu commandes sur le terrain.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="sm:col-span-2">
              <CardHeader>
                <CardTitle>Aperçu</CardTitle>
                <CardDescription>
                  Un exemple d’écran (maquette) : champs de saisie + résultats + actions.
                </CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                  <div className="text-sm font-bold text-[var(--app-text)]">Calcul béton</div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3 text-sm text-[var(--app-text-muted)]">
                      Longueur
                    </div>
                    <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3 text-sm text-[var(--app-text-muted)]">
                      Largeur
                    </div>
                    <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3 text-sm text-[var(--app-text-muted)]">
                      Épaisseur
                    </div>
                  </div>
                  <div className="mt-3 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">
                    <div className="text-xs text-[var(--app-text-muted)]">Résultat</div>
                    <div className="mt-1 text-lg font-extrabold text-[var(--app-text)]">Volume : 0,00 m³</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/register" size="lg">
              Créer un compte gratuit
            </Button>
            <Button href="/pricing" variant="secondary" size="lg">
              Voir les tarifs
            </Button>
          </div>
        </div>
      </AppShell>
      <MarketingFooter />
    </div>
  );
}
