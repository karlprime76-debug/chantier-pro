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
            <Card>
              <CardHeader>
                <CardTitle>Bénéfices concrets</CardTitle>
                <CardDescription>
                  <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                    <div>Quantités plus fiables pour commander ciment, gravier et fer.</div>
                    <div>Historique par chantier pour réutiliser un calcul similaire.</div>
                    <div>Résultats rapides à partager avec l’équipe.</div>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Exemple terrain</CardTitle>
                <CardDescription>
                  Dalle, poteaux ou poutres : tu saisis les dimensions, tu obtiens le volume, puis tu rattaches le calcul au chantier
                  pour garder la trace et éviter les erreurs lors de la commande.
                </CardDescription>
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

          <div className="mt-8 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-5">
            <div className="text-sm font-bold text-[var(--app-text)]">Pour qui ?</div>
            <div className="mt-3 grid gap-2 text-sm text-[var(--app-text-muted)] sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Techniciens génie civil</div>
              <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Chefs de chantier</div>
              <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Conducteurs de travaux</div>
              <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Entrepreneurs BTP</div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-5">
            <div className="text-sm font-bold text-[var(--app-text)]">FAQ</div>
            <div className="mt-3 grid gap-3 text-sm text-[var(--app-text-muted)]">
              <div>
                <div className="font-bold text-[var(--app-text)]">Les calculs remplacent-ils un ingénieur ?</div>
                <div className="mt-1">Non. Ils aident à estimer rapidement, mais ne remplacent pas une validation technique.</div>
              </div>
              <div>
                <div className="font-bold text-[var(--app-text)]">Puis-je sauvegarder mes calculs ?</div>
                <div className="mt-1">Oui, l’objectif est de garder un historique par chantier pour réutiliser et comparer.</div>
              </div>
              <div>
                <div className="font-bold text-[var(--app-text)]">Est-ce utilisable sur téléphone sur le terrain ?</div>
                <div className="mt-1">Oui, l’interface est pensée pour des saisies rapides et des résultats lisibles.</div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-5">
            <div className="text-sm font-bold text-[var(--app-text)]">Autres fonctionnalités</div>
            <div className="mt-3 grid gap-2 text-sm">
              <a className="text-[var(--app-primary)] underline" href="/features/suivi-budget">
                Suivi budget & dépenses
              </a>
              <a className="text-[var(--app-primary)] underline" href="/features/rapports-journaliers">
                Rapports journaliers
              </a>
              <a className="text-[var(--app-primary)] underline" href="/features">
                Voir toutes les fonctionnalités
              </a>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/register" size="lg">
              Créer un compte
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
