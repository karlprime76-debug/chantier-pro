import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { PlanBadge } from "@/components/ui/PlanBadge";
import { SubscribeButton } from "@/components/billing/SubscribeButton";
import { BillingHealthCheck } from "@/components/billing/BillingHealthCheck";
import { Button } from "@/components/ui/Button";
import { getSession } from "@/lib/auth/session";

export default async function PricingPage() {
  const session = await getSession();
  const canSeeBillingHealth = process.env.NODE_ENV !== "production" || session?.role === "ADMIN";
  const freeCtaHref = session ? "/dashboard" : "/register";

  return (
    <div className="min-h-full">
      <MarketingHeader />
      <AppShell className="pb-16">
        <div className="mx-auto w-full max-w-3xl">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--app-text)]">Tarifs</h1>
            <p className="mt-2 text-sm text-[var(--app-text-muted)]">
              3 plans simples pour démarrer gratuitement, passer en mode pro, puis travailler en équipe.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>Gratuit</CardTitle>
                  <PlanBadge variant="free" />
                </div>
                <CardDescription>Pour tester Chantier Pro avec les calculateurs de base.</CardDescription>
              </CardHeader>
              <div className="grid gap-3">
                <div className="text-2xl font-extrabold tracking-tight text-[var(--app-text)]">0 FCFA</div>
                <div className="text-sm text-[var(--app-text-muted)]">par mois</div>
                <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-3">
                  <div className="text-sm font-bold text-[var(--app-text)]">Inclus</div>
                  <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                    <div>Calculateurs de base</div>
                    <div>Accès limité aux historiques</div>
                    <div>Découverte du suivi chantier</div>
                  </div>
                </div>
                <Button href={freeCtaHref} size="lg">
                  Commencer gratuitement
                </Button>
              </div>
            </Card>

            <Card className="ring-1 ring-[var(--cp-accent)]/20">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>Premium</CardTitle>
                  <PlanBadge variant="premium" />
                </div>
                <CardDescription>
                  Pour les pros : calculs + suivi budget/dépenses + rapports.
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
                  <PlanBadge variant="free">Entreprise</PlanBadge>
                </div>
                <CardDescription>
                  Pour travailler en équipe avec accès multi-utilisateurs.
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
            <div className="text-sm font-bold text-[var(--app-text)]">Comparatif</div>

            <div className="mt-3 grid gap-2 sm:hidden">
              <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">
                <div className="text-sm font-bold text-[var(--app-text)]">Disponible maintenant</div>
                <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                  <div className="flex items-center justify-between gap-3"><span>Calculs béton & acier</span><span className="font-semibold text-[var(--app-text)]">Tous</span></div>
                  <div className="flex items-center justify-between gap-3"><span>Historique par chantier</span><span className="font-semibold text-[var(--app-text)]">Limité / Oui / Oui</span></div>
                  <div className="flex items-center justify-between gap-3"><span>Suivi dépenses & budget</span><span className="font-semibold text-[var(--app-text)]">Découverte / Oui / Oui</span></div>
                  <div className="flex items-center justify-between gap-3"><span>Rapports journaliers</span><span className="font-semibold text-[var(--app-text)]">Non / Oui / Oui</span></div>
                  <div className="flex items-center justify-between gap-3"><span>Gestion de projets</span><span className="font-semibold text-[var(--app-text)]">Oui</span></div>
                  <div className="flex items-center justify-between gap-3"><span>Multi-utilisateurs</span><span className="font-semibold text-[var(--app-text)]">Entreprise</span></div>
                </div>
              </div>

              <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">
                <div className="text-sm font-bold text-[var(--app-text)]">Bientôt</div>
                <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                  <div>Export PDF</div>
                  <div>Génération de devis depuis les calculs</div>
                  <div>Templates de devis</div>
                  <div>Exports avancés</div>
                </div>
                <div className="mt-2 text-xs text-[var(--app-text-muted)]">Ces fonctionnalités ne sont pas encore incluses.</div>
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
                    <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Calculs béton & acier</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                    <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Historique par chantier</div>
                    <div className="text-center text-[var(--app-text-muted)]">Limité</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                    <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Suivi dépenses & budget</div>
                    <div className="text-center text-[var(--app-text-muted)]">Découverte</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                    <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Rapports journaliers</div>
                    <div className="text-center text-[var(--app-text-muted)]">Non</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                    <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Gestion de projets</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
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
                    <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Export PDF</div>
                    <div className="text-center text-[var(--app-text-muted)]">Non</div>
                    <div className="text-center text-[var(--app-text-muted)]">Bientôt</div>
                    <div className="text-center text-[var(--app-text-muted)]">Bientôt</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                    <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Génération de devis depuis les calculs</div>
                    <div className="text-center text-[var(--app-text-muted)]">Non</div>
                    <div className="text-center text-[var(--app-text-muted)]">Bientôt</div>
                    <div className="text-center text-[var(--app-text-muted)]">Bientôt</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                    <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Templates de devis</div>
                    <div className="text-center text-[var(--app-text-muted)]">Non</div>
                    <div className="text-center text-[var(--app-text-muted)]">Bientôt</div>
                    <div className="text-center text-[var(--app-text-muted)]">Bientôt</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                    <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Exports avancés</div>
                    <div className="text-center text-[var(--app-text-muted)]">Non</div>
                    <div className="text-center text-[var(--app-text-muted)]">Bientôt</div>
                    <div className="text-center text-[var(--app-text-muted)]">Bientôt</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-[var(--app-text-muted)]">&quot;Bientôt&quot; = fonctionnalité en cours de développement (pas encore incluse).</div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
              <div className="text-sm font-bold text-[var(--app-text)]">Disponible maintenant</div>
              <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                <div>Calculs béton & acier</div>
                <div>Historique par chantier</div>
                <div>Suivi dépenses & budget</div>
                <div>Rapports journaliers</div>
                <div>Gestion de projets</div>
                <div>Accès multi-utilisateurs (Entreprise)</div>
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
              <div className="text-sm font-bold text-[var(--app-text)]">Bientôt</div>
              <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                <div>Export PDF</div>
                <div>Génération de devis depuis les calculs</div>
                <div>Templates de devis</div>
                <div>Exports avancés</div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
            <div className="text-sm font-bold text-[var(--app-text)]">FAQ</div>
            <div className="mt-3 grid gap-3 text-sm text-[var(--app-text-muted)]">
              <div>
                <div className="font-bold text-[var(--app-text)]">Le plan Gratuit suffit-il pour démarrer ?</div>
                <div className="mt-1">Oui, il permet de tester l’app et les calculateurs de base avant de passer au suivi complet.</div>
              </div>
              <div>
                <div className="font-bold text-[var(--app-text)]">Les fonctionnalités “Bientôt” sont-elles déjà incluses ?</div>
                <div className="mt-1">Non. Elles apparaissent ici pour transparence : elles seront ajoutées plus tard.</div>
              </div>
              <div>
                <div className="font-bold text-[var(--app-text)]">Quand mon plan payant est-il activé ?</div>
                <div className="mt-1">Après paiement, l’activation est automatique (ou rapide si vérification nécessaire).</div>
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
