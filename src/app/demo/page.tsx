import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getSession } from "@/lib/auth/session";

export default async function DemoPage() {
  const session = await getSession();

  return (
    <div className="min-h-full">
      <MarketingHeader />
      <AppShell className="pb-16">
        <div className="mx-auto w-full max-w-3xl">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--app-text)]">
              Démo Chantier Pro — Exemple de suivi chantier BTP
            </h1>
            <p className="mt-2 text-sm text-[var(--app-text-muted)]">
              Explore un chantier exemple pour comprendre rapidement l’application, sans configuration et sans données réelles.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            Données de démonstration : toutes les informations ci-dessous sont fictives.
          </div>

          <div className="mt-6 grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Chantier exemple</CardTitle>
                <CardDescription>Villa Akpakpa</CardDescription>
              </CardHeader>
              <div className="grid gap-3 px-6 pb-6 text-sm text-[var(--app-text-muted)]">
                <div className="flex items-center justify-between gap-3"><span>Budget prévisionnel</span><span className="font-semibold text-[var(--app-text)]">1 200 000 FCFA</span></div>
                <div className="flex items-center justify-between gap-3"><span>Dépenses</span><span className="font-semibold text-[var(--app-text)]">420 000 FCFA</span></div>
                <div className="flex items-center justify-between gap-3"><span>Avancement</span><span className="font-semibold text-[var(--app-text)]">68%</span></div>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ce que tu peux explorer</CardTitle>
                <CardDescription>Exemples de modules et modèles.</CardDescription>
              </CardHeader>
              <div className="grid gap-2 px-6 pb-6 text-sm text-[var(--app-text-muted)]">
                <div>Calcul béton : exemple de volume + commande</div>
                <div>Module Fondations : schémas + calculateur Entreprise</div>
                <div>Formulation béton : dosage indicatif + corrections humidité</div>
                <div>Rapport journalier : modèle simple</div>
                <div>Checklist fondations : tâches à cocher</div>
                <div>Rapport de contrôle : sections prêtes à l’emploi</div>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aller plus loin</CardTitle>
                <CardDescription>Découvre les pages fonctionnalités ou crée un compte.</CardDescription>
              </CardHeader>
              <div className="px-6 pb-6 flex flex-col gap-3 sm:flex-row">
                <Button href="/features" variant="secondary" size="lg">
                  Voir les fonctionnalités
                </Button>
                <Button href="/pricing" variant="ghost" size="lg">
                  Voir les tarifs
                </Button>
                {session ? (
                  <Button href="/dashboard" size="lg">
                    Tableau de bord
                  </Button>
                ) : (
                  <Button href="/register" size="lg">
                    Créer un compte
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </AppShell>
      <MarketingFooter />
    </div>
  );
}
