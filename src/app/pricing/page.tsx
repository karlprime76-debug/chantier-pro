import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { PlanBadge } from "@/components/ui/PlanBadge";
import { SubscribeButton } from "@/components/billing/SubscribeButton";
import { BillingHealthCheck } from "@/components/billing/BillingHealthCheck";
import { getSession } from "@/lib/auth/session";

export default async function PricingPage() {
  const session = await getSession();
  const canSeeBillingHealth = process.env.NODE_ENV !== "production" || session?.role === "ADMIN";

  return (
    <div className="min-h-full">
      <MarketingHeader />
      <AppShell className="pb-16">
        <div className="mx-auto w-full max-w-3xl">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--app-text)]">Tarifs</h1>
            <p className="mt-2 text-sm text-[var(--app-text-muted)]">
              Compare les plans Gratuit, Premium et Entreprise pour choisir le niveau adapté à tes besoins.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-5">
            <div className="text-lg font-extrabold tracking-tight text-[var(--app-text)]">
              Passe au niveau pro pour mieux gérer tes chantiers
            </div>
            <div className="mt-2 text-sm text-[var(--app-text-muted)]">
              Gagne du temps, réduis les erreurs de calcul et transforme tes quantités en documents et suivis de chantier.
            </div>
            <div className="mt-4 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_12%)] p-3 text-sm text-[var(--app-text-muted)]">
              Un seul mauvais calcul peut coûter plus cher qu’un abonnement Premium.
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card className="ring-1 ring-[var(--cp-accent)]/20">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>Premium</CardTitle>
                  <PlanBadge variant="premium" />
                </div>
                <CardDescription>
                  Pour les pros qui veulent aller plus vite et mieux suivre les coûts.
                </CardDescription>
              </CardHeader>
              <div className="grid gap-3">
                <div className="text-2xl font-extrabold tracking-tight text-[var(--app-text)]">15 000 FCFA</div>
                <div className="text-sm text-[var(--app-text-muted)]">par mois</div>
                <div className="-mt-2 inline-flex w-fit items-center rounded-full bg-[var(--cp-accent)]/15 px-2 py-0.5 text-[11px] font-bold text-[var(--cp-accent)] ring-1 ring-[var(--cp-accent)]/30">
                  Premium recommandé
                </div>
                <SubscribeButton plan="PREMIUM">S&apos;abonner</SubscribeButton>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>Entreprise</CardTitle>
                  <PlanBadge variant="free" />
                </div>
                <CardDescription>
                  Pour les équipes, la gestion multi-chantiers et les besoins avancés.
                </CardDescription>
              </CardHeader>
              <div className="grid gap-3">
                <div className="text-2xl font-extrabold tracking-tight text-[var(--app-text)]">25 000 FCFA</div>
                <div className="text-sm text-[var(--app-text-muted)]">par mois</div>
                <SubscribeButton plan="ENTERPRISE">S&apos;abonner</SubscribeButton>
              </div>
            </Card>
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
            <div className="text-sm font-bold text-[var(--app-text)]">Comparatif rapide</div>

            <div className="mt-3 grid gap-2 sm:hidden">
              <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">
                <div className="text-sm font-bold text-[var(--app-text)]">Calculateurs de base</div>
                <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                  <div className="flex items-center justify-between gap-3"><span>Gratuit</span><span className="font-semibold text-[var(--app-text)]">Oui</span></div>
                  <div className="flex items-center justify-between gap-3"><span>Premium</span><span className="font-semibold text-[var(--app-text)]">Oui</span></div>
                  <div className="flex items-center justify-between gap-3"><span>Entreprise</span><span className="font-semibold text-[var(--app-text)]">Oui</span></div>
                </div>
              </div>

              <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">
                <div className="text-sm font-bold text-[var(--app-text)]">Calculateurs avancés</div>
                <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                  <div className="flex items-center justify-between gap-3"><span>Gratuit</span><span className="font-semibold text-[var(--app-text)]">Limité</span></div>
                  <div className="flex items-center justify-between gap-3"><span>Premium</span><span className="font-semibold text-[var(--app-text)]">Oui</span></div>
                  <div className="flex items-center justify-between gap-3"><span>Entreprise</span><span className="font-semibold text-[var(--app-text)]">Oui</span></div>
                </div>
              </div>

              <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">
                <div className="text-sm font-bold text-[var(--app-text)]">Sauvegarde des calculs</div>
                <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                  <div className="flex items-center justify-between gap-3"><span>Gratuit</span><span className="font-semibold text-[var(--app-text)]">Limité</span></div>
                  <div className="flex items-center justify-between gap-3"><span>Premium</span><span className="font-semibold text-[var(--app-text)]">Oui</span></div>
                  <div className="flex items-center justify-between gap-3"><span>Entreprise</span><span className="font-semibold text-[var(--app-text)]">Oui</span></div>
                </div>
              </div>

              <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">
                <div className="text-sm font-bold text-[var(--app-text)]">Exports & documents</div>
                <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                  <div className="flex items-center justify-between gap-3"><span>Export PDF</span><span className="font-semibold text-[var(--app-text)]">Premium/Entreprise (bientôt)</span></div>
                  <div className="flex items-center justify-between gap-3"><span>Export Excel</span><span className="font-semibold text-[var(--app-text)]">Entreprise</span></div>
                  <div className="flex items-center justify-between gap-3"><span>Devis depuis les calculs</span><span className="font-semibold text-[var(--app-text)]">Premium/Entreprise (bientôt)</span></div>
                </div>
              </div>

              <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">
                <div className="text-sm font-bold text-[var(--app-text)]">Suivi & équipe</div>
                <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                  <div className="flex items-center justify-between gap-3"><span>Rapports journaliers</span><span className="font-semibold text-[var(--app-text)]">Premium/Entreprise</span></div>
                  <div className="flex items-center justify-between gap-3"><span>Budget / dépenses</span><span className="font-semibold text-[var(--app-text)]">Premium/Entreprise</span></div>
                  <div className="flex items-center justify-between gap-3"><span>Multi-utilisateurs</span><span className="font-semibold text-[var(--app-text)]">Entreprise</span></div>
                  <div className="flex items-center justify-between gap-3"><span>Support prioritaire</span><span className="font-semibold text-[var(--app-text)]">Premium/Entreprise</span></div>
                </div>
              </div>
            </div>

            <div className="mt-3 hidden overflow-x-auto sm:block">
              <div className="min-w-[680px]">
                <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-2 text-xs font-bold text-[var(--app-text-muted)]">
                  <div />
                  <div className="text-center">Gratuit</div>
                  <div className="text-center">Premium</div>
                  <div className="text-center">Entreprise</div>
                </div>
                <div className="mt-2 grid gap-2 text-sm">
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                    <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Calculateurs de base</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                    <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Calculateurs avancés</div>
                    <div className="text-center text-[var(--app-text-muted)]">Limité</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                    <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Sauvegarde des calculs par chantier</div>
                    <div className="text-center text-[var(--app-text-muted)]">Limité</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                    <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Export PDF</div>
                    <div className="text-center text-[var(--app-text-muted)]">Non</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui (bientôt)</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui (bientôt)</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                    <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Devis depuis les calculs</div>
                    <div className="text-center text-[var(--app-text-muted)]">Non</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui (bientôt)</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui (bientôt)</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                    <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Rapports journaliers</div>
                    <div className="text-center text-[var(--app-text-muted)]">Non</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                    <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Suivi budget / dépenses</div>
                    <div className="text-center text-[var(--app-text-muted)]">Limité</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                    <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Multi-utilisateurs</div>
                    <div className="text-center text-[var(--app-text-muted)]">Non</div>
                    <div className="text-center text-[var(--app-text-muted)]">Non</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                    <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Export Excel</div>
                    <div className="text-center text-[var(--app-text-muted)]">Non</div>
                    <div className="text-center text-[var(--app-text-muted)]">Bientôt</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                    <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Support prioritaire</div>
                    <div className="text-center text-[var(--app-text-muted)]">Non</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
            Après paiement, ton plan est activé automatiquement.
          </div>

          <div className="mt-6">
            <div className="text-lg font-extrabold tracking-tight text-[var(--app-text)]">Pourquoi passer à Premium ?</div>
            <div className="mt-2 text-sm text-[var(--app-text-muted)]">
              Des bénéfices concrets pour les hommes de terrain et les bureaux.
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                <div className="text-sm font-bold text-[var(--app-text)]">Réduire les erreurs de commande</div>
                <div className="mt-1 text-sm text-[var(--app-text-muted)]">
                  Quantités plus fiables, marge de perte maîtrisée, moins d&apos;allers-retours.
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                <div className="text-sm font-bold text-[var(--app-text)]">Gagner du temps sur les quantités</div>
                <div className="mt-1 text-sm text-[var(--app-text-muted)]">
                  Calculateurs avancés et historiques pour répéter un calcul en quelques secondes.
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                <div className="text-sm font-bold text-[var(--app-text)]">Partager plus vite</div>
                <div className="mt-1 text-sm text-[var(--app-text-muted)]">
                  Export PDF (bientôt) et partage WhatsApp pour envoyer au patron, au client ou au fournisseur.
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                <div className="text-sm font-bold text-[var(--app-text)]">Suivi chantier (budget + rapports)</div>
                <div className="mt-1 text-sm text-[var(--app-text-muted)]">
                  Dépenses, budget prévu vs réel et rapports journaliers pour mieux piloter.
                </div>
              </div>
            </div>
          </div>

          {canSeeBillingHealth ? <BillingHealthCheck /> : null}
        </div>
      </AppShell>
      <MarketingFooter />
    </div>
  );
}
