"use client";

import { useMemo, useState } from "react";

import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { PlanBadge } from "@/components/ui/PlanBadge";
import { SubscribeButton } from "@/components/billing/SubscribeButton";
import { cn } from "@/lib/cn";

type TabKey = "free" | "premium" | "enterprise";

type Tab = {
  key: TabKey;
  label: string;
  badgeVariant: "free" | "premium";
};

const TABS: Tab[] = [
  { key: "free", label: "Gratuit", badgeVariant: "free" },
  { key: "premium", label: "Premium", badgeVariant: "premium" },
  { key: "enterprise", label: "Entreprise", badgeVariant: "free" },
];

export function PlanTabs({ defaultTab = "premium" }: { defaultTab?: TabKey }) {
  const [active, setActive] = useState<TabKey>(defaultTab);
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const startHref = isAuthenticated ? "/dashboard/projects/new" : "/register?next=/dashboard/projects/new";

  const activeTab = useMemo(() => TABS.find((t) => t.key === active) ?? TABS[0], [active]);

  return (
    <Card className="w-full max-w-full overflow-hidden">
      <CardHeader>
        <div className="grid gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <CardTitle>Passe au niveau pro pour mieux gérer tes chantiers</CardTitle>
              <CardDescription>
                Gagne du temps, réduis les erreurs de calcul et transforme tes quantités en devis, rapports et suivis chantier.
              </CardDescription>
            </div>
            <PlanBadge variant={activeTab.badgeVariant} />
          </div>

          <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_8%)] p-3 text-sm text-[var(--app-text-muted)]">
            Avec Chantier Pro Premium, l’objectif est simple : moins d’erreurs, moins de temps perdu, plus de contrôle sur chaque chantier.
          </div>
        </div>

        <div className="mt-4 w-full max-w-full rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_8%)] p-1">
          <div className="grid w-full grid-cols-3 gap-1">
            {TABS.map((t) => {
              const isActive = t.key === active;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActive(t.key)}
                  className={cn(
                    "min-w-0 rounded-2xl px-2 py-2 text-[11px] font-extrabold tracking-tight transition sm:px-3 sm:text-xs",
                    isActive
                      ? "bg-[color-mix(in_oklab,var(--app-text),transparent_92%)] text-[var(--app-text)] ring-1 ring-[var(--app-card-border)]"
                      : "text-[var(--app-text-muted)] hover:bg-[color-mix(in_oklab,var(--app-text),transparent_94%)] hover:text-[var(--app-text)]",
                  )}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <div className="px-4 pb-5 sm:px-6 sm:pb-6">
        {active === "free" ? (
          <div className="grid gap-4">
            <div>
              <div className="flex items-center gap-2">
                <PlanBadge variant="free" />
                <div className="text-sm font-extrabold text-[var(--app-text)]">Plan Gratuit</div>
              </div>
              <div className="mt-1 text-sm text-[var(--app-text-muted)]">Parfait pour découvrir Chantier Pro</div>
            </div>

            <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_8%)] p-4">
              <div className="text-sm font-bold text-[var(--app-text)]">Mini comparatif</div>

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
                  <div className="text-sm font-bold text-[var(--app-text)]">Export PDF</div>
                  <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                    <div className="flex items-center justify-between gap-3"><span>Gratuit</span><span className="font-semibold text-[var(--app-text)]">Non</span></div>
                    <div className="flex items-center justify-between gap-3"><span>Premium</span><span className="font-semibold text-[var(--app-text)]">Oui</span></div>
                    <div className="flex items-center justify-between gap-3"><span>Entreprise</span><span className="font-semibold text-[var(--app-text)]">Oui</span></div>
                  </div>
                </div>

                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">
                  <div className="text-sm font-bold text-[var(--app-text)]">Multi-utilisateurs</div>
                  <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                    <div className="flex items-center justify-between gap-3"><span>Gratuit</span><span className="font-semibold text-[var(--app-text)]">Non</span></div>
                    <div className="flex items-center justify-between gap-3"><span>Premium</span><span className="font-semibold text-[var(--app-text)]">Non</span></div>
                    <div className="flex items-center justify-between gap-3"><span>Entreprise</span><span className="font-semibold text-[var(--app-text)]">Oui</span></div>
                  </div>
                </div>
              </div>

              <div className="mt-3 hidden overflow-x-auto sm:block">
                <div className="min-w-[540px]">
                  <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-2 text-xs font-bold text-[var(--app-text-muted)]">
                    <div />
                    <div className="text-center">Gratuit</div>
                    <div className="text-center">Premium</div>
                    <div className="text-center">Entreprise</div>
                  </div>
                  <div className="mt-2 grid gap-2 text-sm">
                    <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                      <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Calculateurs de base</div>
                      <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                      <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                      <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                    </div>
                    <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                      <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Calculateurs avancés</div>
                      <div className="text-center text-[var(--app-text-muted)]">Limité</div>
                      <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                      <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                    </div>
                    <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                      <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Export PDF</div>
                      <div className="text-center text-[var(--app-text-muted)]">Non</div>
                      <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                      <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                    </div>
                    <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] px-3 py-2">
                      <div className="text-[color-mix(in_oklab,var(--app-text),transparent_12%)]">Multi-utilisateurs</div>
                      <div className="text-center text-[var(--app-text-muted)]">Non</div>
                      <div className="text-center text-[var(--app-text-muted)]">Non</div>
                      <div className="text-center text-[var(--app-text-muted)]">Oui</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-4">
                <div className="text-sm font-bold text-[var(--app-text)]">Inclus</div>
                <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                  <div>Compte Chantier Pro</div>
                  <div>Accéder au dashboard</div>
                  <div>Calculateur béton simple</div>
                  <div>Calculateur acier simple</div>
                  <div>Quelques calculateurs de base</div>
                  <div>Découverte des fonctionnalités chantier</div>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_8%)] p-4">
                <div className="text-sm font-bold text-[var(--app-text)]">Limites</div>
                <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                  <div>Pas d’export PDF</div>
                  <div>Pas de devis avancés</div>
                  <div>Pas de rapports journaliers</div>
                  <div>Pas d’historique illimité</div>
                  <div>Pas de calculateurs avancés</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button href={startHref} size="lg" variant="secondary">
                {isAuthenticated ? "Créer mon chantier" : "Commencer gratuitement"}
              </Button>
              <Button type="button" size="lg" variant="ghost" onClick={() => setActive("premium")}>
                Voir Premium
              </Button>
            </div>
          </div>
        ) : active === "premium" ? (
          <div className="grid gap-4">
            <div>
              <div className="flex items-center gap-2">
                <PlanBadge variant="premium" />
                <div className="text-sm font-extrabold text-[var(--app-text)]">Plan Premium</div>
                <span className="rounded-full bg-[var(--cp-accent)]/15 px-2 py-0.5 text-[11px] font-bold text-[var(--cp-accent)] ring-1 ring-[var(--cp-accent)]/30">
                  Premium recommandé
                </span>
              </div>
              <div className="mt-1 text-sm text-[var(--app-text-muted)]">
                Pour les professionnels qui veulent gagner du temps et mieux gérer leurs chantiers
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_8%)] p-4">
              <div className="text-sm font-bold text-[var(--app-text)]">Bénéfices concrets</div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3 text-sm text-[var(--app-text-muted)]">
                  Gagne du temps sur chaque chantier
                </div>
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3 text-sm text-[var(--app-text-muted)]">
                  Réduis les erreurs de quantité
                </div>
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3 text-sm text-[var(--app-text-muted)]">
                  Retrouve tous tes calculs par chantier
                </div>
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3 text-sm text-[var(--app-text-muted)]">
                  Suis les dépenses réelles face au budget prévu
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-4">
                <div className="text-sm font-bold text-[var(--app-text)]">Fonctionnalités</div>
                <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                  <div>Tous les calculateurs avancés</div>
                  <div>Historique des calculs</div>
                  <div>Sauvegarde des calculs par chantier</div>
                  <div>Export PDF</div>
                  <div>Devis générés depuis les calculs</div>
                  <div>Rapports journaliers chantier</div>
                  <div>Outils avancés de suivi</div>
                  <div>Support prioritaire</div>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_8%)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-bold text-[var(--app-text)]">Offres disponibles</div>
                  <PlanBadge variant="premium" />
                </div>
                <div className="mt-3 grid gap-3">
                  <div>
                    <div className="text-2xl font-extrabold tracking-tight text-[var(--app-text)]">15 000 FCFA</div>
                    <div className="text-sm text-[var(--app-text-muted)]">par mois</div>
                  </div>
                  <SubscribeButton plan="PREMIUM">Passer à Premium</SubscribeButton>
                  <Button href="/pricing" variant="ghost" size="sm">
                    Voir le détail des plans
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_8%)] p-4">
              <div className="text-sm font-bold text-[var(--app-text)]">Pensé pour le terrain et le bureau</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">
                  <div className="text-sm font-bold text-[var(--app-text)]">Hommes de terrain</div>
                  <div className="mt-1 text-sm text-[var(--app-text-muted)]">
                    Calculs rapides sur chantier, rapports journaliers et partage simple des résultats.
                  </div>
                </div>
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">
                  <div className="text-sm font-bold text-[var(--app-text)]">Bureaux et responsables</div>
                  <div className="mt-1 text-sm text-[var(--app-text-muted)]">
                    Centralise les données, suis les coûts et prépare des documents propres.
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            <div>
              <div className="flex items-center gap-2">
                <PlanBadge variant="free" />
                <div className="text-sm font-extrabold text-[var(--app-text)]">Plan Entreprise</div>
              </div>
              <div className="mt-1 text-sm text-[var(--app-text-muted)]">
                Pour équipes chantier, bureaux d’études et entreprises BTP
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-4">
                <div className="text-sm font-bold text-[var(--app-text)]">Pour les équipes</div>
                <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                  <div>Multi-utilisateurs</div>
                  <div>Gestion d’équipe</div>
                  <div>Rôles et permissions</div>
                  <div>Suivi multi-chantiers</div>
                  <div>Validation des dépenses</div>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_8%)] p-4">
                <div className="text-sm font-bold text-[var(--app-text)]">Pilotage & exports</div>
                <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                  <div>Export PDF/Excel</div>
                  <div>Devis avec logo entreprise</div>
                  <div>Dashboard rentabilité</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_8%)] p-4">
              <div>
                <div className="text-2xl font-extrabold tracking-tight text-[var(--app-text)]">25 000 FCFA</div>
                <div className="text-sm text-[var(--app-text-muted)]">par mois</div>
              </div>
              <div className="mt-3">
                <SubscribeButton plan="ENTERPRISE">Passer à Entreprise</SubscribeButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
