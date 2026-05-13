import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function FeatureSuiviBudgetPage() {
  return (
    <div className="min-h-full">
      <MarketingHeader />
      <AppShell className="pb-16">
        <div className="mx-auto w-full max-w-3xl">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--app-text)]">Suivi budget & dépenses</h1>
            <p className="mt-2 text-sm text-[var(--app-text-muted)]">
              Note les dépenses au fil du chantier et garde un suivi clair du budget prévu vs réel.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Suivi terrain</CardTitle>
                <CardDescription>Saisis une dépense en quelques secondes, même sur téléphone.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Budget clair</CardTitle>
                <CardDescription>Visualise rapidement si tu es dans le budget ou si ça dérive.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Bénéfices concrets</CardTitle>
                <CardDescription>
                  <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                    <div>Moins de dépenses oubliées (carburant, location, petits achats).</div>
                    <div>Prévu vs réel plus lisible pour anticiper les dépassements.</div>
                    <div>Historique par chantier pour justifier et mieux piloter.</div>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Exemple terrain</CardTitle>
                <CardDescription>
                  Tu enregistres les dépenses au fil de la journée (matériaux, main d’œuvre, transport) et tu compares le total au budget
                  prévu du chantier pour corriger tôt.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="sm:col-span-2">
              <CardHeader>
                <CardTitle>Aperçu</CardTitle>
                <CardDescription>Maquette d’un tableau de dépenses et d’un résumé budget.</CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                    <div className="text-xs text-[var(--app-text-muted)]">Budget prévu</div>
                    <div className="mt-1 text-lg font-extrabold text-[var(--app-text)]">0 FCFA</div>
                  </div>
                  <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                    <div className="text-xs text-[var(--app-text-muted)]">Dépenses</div>
                    <div className="mt-1 text-lg font-extrabold text-[var(--app-text)]">0 FCFA</div>
                  </div>
                  <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                    <div className="text-xs text-[var(--app-text-muted)]">Écart</div>
                    <div className="mt-1 text-lg font-extrabold text-[var(--app-text)]">0 FCFA</div>
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
