import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getSession } from "@/lib/auth/session";

export default async function FeatureRapportsJournaliersPage() {
  const session = await getSession();

  return (
    <div className="min-h-full">
      <MarketingHeader />
      <AppShell className="pb-16">
        <div className="mx-auto w-full max-w-3xl">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--app-text)]">Rapports journaliers</h1>
            <p className="mt-2 text-sm text-[var(--app-text-muted)]">
              Garde un journal chantier clair : avancement, incidents, notes et historique par projet.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Rapports plus propres</CardTitle>
                <CardDescription>Un format homogène pour envoyer au bureau, au patron ou au client.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Historique centralisé</CardTitle>
                <CardDescription>Retrouve rapidement un ancien rapport sans fouiller dans WhatsApp.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Bénéfices concrets</CardTitle>
                <CardDescription>
                  <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                    <div>Meilleure traçabilité (avancement, incidents, décisions).</div>
                    <div>Communication plus claire avec le bureau, le client ou le patron.</div>
                    <div>Historique par chantier pour comparer semaine après semaine.</div>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Exemple terrain</CardTitle>
                <CardDescription>
                  En fin de journée, tu notes l’avancement, l’équipe présente et les incidents. Le lendemain, tu repars avec un historique
                  clair et tu évites les malentendus.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="sm:col-span-2">
              <CardHeader>
                <CardTitle>Aperçu</CardTitle>
                <CardDescription>Maquette d’un rapport journalier avec sections clés.</CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                  <div className="text-sm font-bold text-[var(--app-text)]">Rapport du jour</div>
                  <div className="mt-2 grid gap-2">
                    <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3 text-sm text-[var(--app-text-muted)]">
                      Avancement : ...
                    </div>
                    <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3 text-sm text-[var(--app-text-muted)]">
                      Équipe / tâches : ...
                    </div>
                    <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3 text-sm text-[var(--app-text-muted)]">
                      Incidents / remarques : ...
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {session ? (
              <Button href="/dashboard" size="lg">
                Tableau de bord
              </Button>
            ) : (
              <Button href="/register" size="lg">
                Créer un compte gratuit
              </Button>
            )}
            <Button href="/pricing" variant="secondary" size="lg">
              Voir les tarifs
            </Button>
          </div>

          <div className="mt-8 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-5">
            <div className="text-sm font-bold text-[var(--app-text)]">Pour qui ?</div>
            <div className="mt-3 grid gap-2 text-sm text-[var(--app-text-muted)] sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Chefs de chantier</div>
              <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Conducteurs de travaux</div>
              <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Bureaux / responsables projet</div>
              <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Entrepreneurs BTP</div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-5">
            <div className="text-sm font-bold text-[var(--app-text)]">FAQ</div>
            <div className="mt-3 grid gap-3 text-sm text-[var(--app-text-muted)]">
              <div>
                <div className="font-bold text-[var(--app-text)]">Pourquoi des rapports journaliers ?</div>
                <div className="mt-1">Pour garder une trace claire (avancement, incidents, décisions) et mieux communiquer.</div>
              </div>
              <div>
                <div className="font-bold text-[var(--app-text)]">Est-ce que je peux retrouver l’historique par chantier ?</div>
                <div className="mt-1">Oui, l’objectif est de centraliser l’historique et éviter la perte d’infos.</div>
              </div>
              <div>
                <div className="font-bold text-[var(--app-text)]">Est-ce utilisable directement sur mobile ?</div>
                <div className="mt-1">Oui, pour saisir en fin de journée et partager facilement.</div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-5">
            <div className="text-sm font-bold text-[var(--app-text)]">Autres fonctionnalités</div>
            <div className="mt-3 grid gap-2 text-sm">
              <a className="text-[var(--app-primary)] underline" href="/features/calculs-beton-acier">
                Calculs béton & acier
              </a>
              <a className="text-[var(--app-primary)] underline" href="/features/suivi-budget">
                Suivi budget & dépenses
              </a>
              <a className="text-[var(--app-primary)] underline" href="/features">
                Voir toutes les fonctionnalités
              </a>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {session ? (
              <Button href="/dashboard" size="lg">
                Tableau de bord
              </Button>
            ) : (
              <Button href="/register" size="lg">
                Créer un compte
              </Button>
            )}
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
