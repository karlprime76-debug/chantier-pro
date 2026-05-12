import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function FeatureRapportsJournaliersPage() {
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
