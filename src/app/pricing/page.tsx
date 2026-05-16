import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { PlanBadge } from "@/components/ui/PlanBadge";
import { SubscribeButton } from "@/components/billing/SubscribeButton";
import { BillingHealthCheck } from "@/components/billing/BillingHealthCheck";
import { Button } from "@/components/ui/Button";
import { getSession } from "@/lib/auth/session";
import type { UserPlan } from "@/lib/subscription/access";
import { getEffectiveUserPlan } from "@/lib/subscription/server";

export default async function PricingPage() {
  const session = await getSession();
  const currentPlan: UserPlan | null = session ? await getEffectiveUserPlan(session) : null;
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
            <Card
              className={
                currentPlan === "FREE"
                  ? "h-full ring-2 ring-[var(--cp-accent)]/25"
                  : "h-full"
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>Gratuit</CardTitle>
                  <PlanBadge variant="free" />
                </div>
                <CardDescription>Pour tester Chantier Pro avec les calculateurs de base.</CardDescription>
              </CardHeader>
              <div className="flex h-full flex-col gap-3 px-6 pb-6">
                <div className="text-2xl font-extrabold tracking-tight text-[var(--app-text)]">0 FCFA</div>
                <div className="text-sm text-[var(--app-text-muted)]">par mois</div>
                {currentPlan === "FREE" ? (
                  <div className="-mt-1 inline-flex w-fit items-center rounded-full bg-[var(--cp-accent)]/15 px-2 py-0.5 text-[11px] font-bold text-[var(--cp-accent)] ring-1 ring-[var(--cp-accent)]/30">
                    Offre actuelle
                  </div>
                ) : null}
                <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-3">
                  <div className="text-sm font-bold text-[var(--app-text)]">Inclus</div>
                  <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                    <div>Calculateurs de base</div>
                    <div>Accès limité aux historiques</div>
                    <div>Découverte du suivi chantier</div>
                    <div>Démo chantier exemple</div>
                    <div>Support standard</div>
                  </div>
                </div>
                <div className="mt-auto pt-1">
                  {session ? (
                    currentPlan === "FREE" ? (
                      <Button type="button" size="lg" className="w-full justify-center" disabled>
                        Offre actuelle
                      </Button>
                    ) : (
                      <Button type="button" size="lg" className="w-full justify-center" disabled>
                        Inclus
                      </Button>
                    )
                  ) : (
                    <Button href={freeCtaHref} size="lg" className="w-full justify-center">
                      Commencer gratuitement
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            <Card
              className={
                currentPlan === "PREMIUM"
                  ? "h-full ring-2 ring-[var(--cp-accent)]/35"
                  : "h-full ring-1 ring-[var(--cp-accent)]/20"
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>Pro</CardTitle>
                  <PlanBadge variant="premium" />
                </div>
                <CardDescription>
                  Pour les pros : calculs + suivi budget/dépenses + rapports.
                </CardDescription>
              </CardHeader>
              <div className="flex h-full flex-col gap-3 px-6 pb-6">
                <div className="text-2xl font-extrabold tracking-tight text-[var(--app-text)]">15 000 FCFA</div>
                <div className="text-sm text-[var(--app-text-muted)]">par mois</div>
                {currentPlan === "PREMIUM" ? (
                  <div className="-mt-2 inline-flex w-fit items-center rounded-full bg-[var(--cp-accent)]/15 px-2 py-0.5 text-[11px] font-bold text-[var(--cp-accent)] ring-1 ring-[var(--cp-accent)]/30">
                    Offre actuelle
                  </div>
                ) : (
                  <div className="-mt-2 inline-flex w-fit items-center rounded-full bg-[var(--cp-accent)]/15 px-2 py-0.5 text-[11px] font-bold text-[var(--cp-accent)] ring-1 ring-[var(--cp-accent)]/30">
                    Pro recommandé
                  </div>
                )}
                <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-3">
                  <div className="text-sm font-bold text-[var(--app-text)]">Inclus</div>
                  <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                    <div>Calculs béton & acier avancés</div>
                    <div>Historique par chantier</div>
                    <div>Suivi dépenses & budget</div>
                    <div>Rapports journaliers</div>
                    <div>Export PDF (si disponible)</div>
                    <div>Support prioritaire (léger)</div>
                  </div>
                </div>

                <div className="mt-auto pt-1">
                  {session ? (
                    currentPlan === "PREMIUM" ? (
                      <Button type="button" size="lg" className="w-full justify-center" disabled>
                        Offre actuelle
                      </Button>
                    ) : currentPlan === "ENTERPRISE" ? (
                      <Button type="button" size="lg" className="w-full justify-center" disabled>
                        Inclus
                      </Button>
                    ) : (
                      <SubscribeButton plan="PREMIUM" className="w-full justify-center">
                        Passer à Pro
                      </SubscribeButton>
                    )
                  ) : (
                    <SubscribeButton plan="PREMIUM" className="w-full justify-center">
                      S&apos;abonner
                    </SubscribeButton>
                  )}
                </div>
              </div>
            </Card>

            <Card
              className={
                currentPlan === "ENTERPRISE"
                  ? "h-full ring-2 ring-[var(--cp-accent)]/35"
                  : "h-full"
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>Entreprise</CardTitle>
                  <PlanBadge variant="free">Entreprise</PlanBadge>
                </div>
                <CardDescription>
                  Pour travailler en équipe avec accès multi-utilisateurs.
                </CardDescription>
              </CardHeader>
              <div className="flex h-full flex-col gap-3 px-6 pb-6">
                <div className="text-2xl font-extrabold tracking-tight text-[var(--app-text)]">25 000 FCFA</div>
                <div className="text-sm text-[var(--app-text-muted)]">par mois</div>
                {currentPlan === "ENTERPRISE" ? (
                  <div className="-mt-1 inline-flex w-fit items-center rounded-full bg-[var(--cp-accent)]/15 px-2 py-0.5 text-[11px] font-bold text-[var(--cp-accent)] ring-1 ring-[var(--cp-accent)]/30">
                    Offre actuelle
                  </div>
                ) : null}
                <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-3">
                  <div className="text-sm font-bold text-[var(--app-text)]">Inclus</div>
                  <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                    <div>Multi-utilisateurs</div>
                    <div>Validation des dépenses</div>
                    <div>Exports avancés</div>
                    <div>Support prioritaire WhatsApp</div>
                  </div>

                  <div className="mt-3">
                    <div className="text-xs font-bold text-[color-mix(in_oklab,var(--app-text),transparent_45%)]">Modules inclus</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-full bg-[color-mix(in_oklab,var(--app-card),transparent_12%)] px-2 py-1 text-[11px] font-bold text-[var(--app-text-muted)] ring-1 ring-[var(--app-card-border)]">
                        Fondations
                      </span>
                      <span className="inline-flex items-center rounded-full bg-[color-mix(in_oklab,var(--app-card),transparent_12%)] px-2 py-1 text-[11px] font-bold text-[var(--app-text-muted)] ring-1 ring-[var(--app-card-border)]">
                        Formulation béton
                      </span>
                      <span className="inline-flex items-center rounded-full bg-[color-mix(in_oklab,var(--app-card),transparent_12%)] px-2 py-1 text-[11px] font-bold text-[var(--app-text-muted)] ring-1 ring-[var(--app-card-border)]">
                        Checklists chantier
                      </span>
                      <span className="inline-flex items-center rounded-full bg-[color-mix(in_oklab,var(--app-card),transparent_12%)] px-2 py-1 text-[11px] font-bold text-[var(--app-text-muted)] ring-1 ring-[var(--app-card-border)]">
                        Rapports de contrôle
                      </span>
                      <span className="inline-flex items-center rounded-full bg-[color-mix(in_oklab,var(--app-card),transparent_12%)] px-2 py-1 text-[11px] font-bold text-[var(--app-text-muted)] ring-1 ring-[var(--app-card-border)]">
                        Exports avancés
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-[var(--app-text-muted)]">
                  Pour les entreprises BTP qui gèrent plusieurs chantiers, équipes et rapports.
                </div>

                <div className="mt-auto pt-1">
                  {session ? (
                    currentPlan === "ENTERPRISE" ? (
                      <Button type="button" size="lg" className="w-full justify-center" disabled>
                        Offre actuelle
                      </Button>
                    ) : (
                      <SubscribeButton plan="ENTERPRISE" className="w-full justify-center">
                        Passer à Entreprise
                      </SubscribeButton>
                    )
                  ) : (
                    <SubscribeButton plan="ENTERPRISE" className="w-full justify-center">
                      S&apos;abonner
                    </SubscribeButton>
                  )}
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
              <div className="text-sm font-bold text-[var(--app-text)]">Pourquoi choisir l’offre Entreprise ?</div>
              <div className="mt-1 text-sm text-[var(--app-text-muted)]">
                Des modules avancés pour piloter plusieurs chantiers avec une traçabilité plus propre.
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Module Fondations complet</CardTitle>
                  <CardDescription>
                    Calculs, étapes et quantitatifs pour semelles, longrines, radiers, puits et pieux.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Formulation de béton</CardTitle>
                  <CardDescription>
                    Dosage indicatif, corrections d’humidité, quantités par m³ et coût estimatif.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rapports de contrôle</CardTitle>
                  <CardDescription>
                    Contrôle coffrage, ferraillage, bétonnage, cure, réserves et non-conformités.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Checklists chantier avancées</CardTitle>
                  <CardDescription>
                    Suivi des étapes critiques du chantier, du terrassement à la réception.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
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
                <div className="text-sm font-bold text-[var(--app-text)]">Disponible selon votre plan</div>
                <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                  <div>Export PDF (Pro / Entreprise)</div>
                  <div>Devis depuis les calculs (Pro / Entreprise)</div>
                  <div>Templates de devis (Pro / Entreprise)</div>
                  <div>Exports avancés (Entreprise)</div>
                  <div>Module Fondations (Entreprise)</div>
                  <div>Formulation de béton (Entreprise)</div>
                  <div>Checklists chantier (Entreprise)</div>
                  <div>Rapports de contrôle (Entreprise)</div>
                  <div>Démo / modèles chantier (Entreprise)</div>
                </div>
                <div className="mt-2 text-xs text-[var(--app-text-muted)]">Certaines fonctionnalités avancées nécessitent un upgrade.</div>
              </div>
            </div>

            <div className="mt-3 hidden overflow-x-auto sm:block">
              <div className="min-w-[680px]">
                <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-2 text-xs font-bold text-[var(--app-text-muted)]">
                  <div />
                  <div className="text-center">Gratuit</div>
                  <div className="text-center">Pro</div>
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
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                    <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Génération de devis depuis les calculs</div>
                    <div className="text-center text-[var(--app-text-muted)]">Non</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                    <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Templates de devis</div>
                    <div className="text-center text-[var(--app-text-muted)]">Non</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                    <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Exports avancés</div>
                    <div className="text-center text-[var(--app-text-muted)]">Non</div>
                    <div className="text-center text-[var(--app-text-muted)]">Non</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                    <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Module Fondations</div>
                    <div className="text-center text-[var(--app-text-muted)]">Non</div>
                    <div className="text-center text-[var(--app-text-muted)]">Non</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                    <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Formulation de béton</div>
                    <div className="text-center text-[var(--app-text-muted)]">Non</div>
                    <div className="text-center text-[var(--app-text-muted)]">Non</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                    <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Checklists chantier</div>
                    <div className="text-center text-[var(--app-text-muted)]">Non</div>
                    <div className="text-center text-[var(--app-text-muted)]">Non</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                  </div>
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                    <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Rapports de contrôle</div>
                    <div className="text-center text-[var(--app-text-muted)]">Non</div>
                    <div className="text-center text-[var(--app-text-muted)]">Non</div>
                    <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-[var(--app-text-muted)]">Les fonctionnalités avancées varient selon le plan choisi.</div>
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
                <div className="font-bold text-[var(--app-text)]">Quelles fonctionnalités avancées sont incluses selon le plan ?</div>
                <div className="mt-1">Certaines fonctionnalités avancées sont disponibles uniquement avec Pro ou Entreprise.</div>
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
