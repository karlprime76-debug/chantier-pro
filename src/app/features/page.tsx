import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function FeaturesPage() {
  return (
    <div className="min-h-full">
      <MarketingHeader />
      <AppShell className="pb-16">
        <div className="mx-auto w-full max-w-3xl">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--app-text)]">Fonctionnalités</h1>
            <p className="mt-2 text-sm text-[var(--app-text-muted)]">
              Calculs, suivi budget/dépenses, rapports journaliers : tout pour piloter tes chantiers BTP depuis ton téléphone.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Calculs béton & acier</CardTitle>
                <CardDescription>Estime rapidement les quantités et réduis les erreurs de commande sur chantier.</CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <Button href="/features/calculs-beton-acier" variant="secondary">
                  Voir la fonctionnalité
                </Button>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Suivi budget & dépenses</CardTitle>
                <CardDescription>Note les dépenses au fil du chantier et compare prévu vs réel.</CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <Button href="/features/suivi-budget" variant="secondary">
                  Voir la fonctionnalité
                </Button>
              </div>
            </Card>

            <Card className="sm:col-span-2">
              <CardHeader>
                <CardTitle>Rapports journaliers</CardTitle>
                <CardDescription>Garde un journal chantier clair et retrouve l’historique par projet.</CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <Button href="/features/rapports-journaliers" variant="secondary">
                  Voir la fonctionnalité
                </Button>
              </div>
            </Card>
          </div>

          <div className="mt-6">
            <Button href="/pricing" size="lg">
              Voir les tarifs
            </Button>
          </div>

          <div className="mt-8 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-5">
            <div className="text-sm font-bold text-[var(--app-text)]">Pour qui ?</div>
            <div className="mt-3 grid gap-2 text-sm text-[var(--app-text-muted)] sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Techniciens / ingénieurs</div>
              <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Chefs de chantier</div>
              <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Conducteurs de travaux</div>
              <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">PME BTP</div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-5">
            <div className="text-sm font-bold text-[var(--app-text)]">FAQ</div>
            <div className="mt-3 grid gap-3 text-sm text-[var(--app-text-muted)]">
              <div>
                <div className="font-bold text-[var(--app-text)]">Les fonctionnalités sont-elles utilisables sur mobile ?</div>
                <div className="mt-1">Oui, Chantier Pro est pensé mobile-first pour une saisie rapide sur le terrain.</div>
              </div>
              <div>
                <div className="font-bold text-[var(--app-text)]">Dois-je créer un compte pour découvrir ?</div>
                <div className="mt-1">Tu peux lire les pages fonctionnalités, puis créer un compte quand tu es prêt à démarrer.</div>
              </div>
              <div>
                <div className="font-bold text-[var(--app-text)]">Quel plan choisir ?</div>
                <div className="mt-1">Commence en Gratuit, puis passe en Premium/Entreprise selon tes besoins de suivi et d’équipe.</div>
              </div>
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
