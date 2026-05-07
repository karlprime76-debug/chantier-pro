"use client";

import { useMemo, useState } from "react";

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
  { key: "enterprise", label: "Entreprise", badgeVariant: "premium" },
];

export function PlanTabs({ defaultTab = "premium" }: { defaultTab?: TabKey }) {
  const [active, setActive] = useState<TabKey>(defaultTab);

  const activeTab = useMemo(() => TABS.find((t) => t.key === active) ?? TABS[0], [active]);

  return (
    <Card>
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

          <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-white/70">
            Avec Chantier Pro Premium, l’objectif est simple : moins d’erreurs, moins de temps perdu, plus de contrôle sur chaque chantier.
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-1">
          <div className="grid grid-cols-3 gap-1">
            {TABS.map((t) => {
              const isActive = t.key === active;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActive(t.key)}
                  className={cn(
                    "rounded-2xl px-3 py-2 text-xs font-extrabold tracking-tight transition",
                    isActive
                      ? "bg-white/10 text-white ring-1 ring-white/15"
                      : "text-white/65 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <div className="px-6 pb-6">
        {active === "free" ? (
          <div className="grid gap-4">
            <div>
              <div className="flex items-center gap-2">
                <PlanBadge variant="free" />
                <div className="text-sm font-extrabold text-white">Plan Gratuit</div>
              </div>
              <div className="mt-1 text-sm text-white/60">Parfait pour découvrir Chantier Pro</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-sm font-bold text-white">Mini comparatif</div>
              <div className="mt-3 overflow-x-auto">
                <div className="min-w-[540px]">
                  <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-2 text-xs font-bold text-white/60">
                    <div />
                    <div className="text-center">Gratuit</div>
                    <div className="text-center">Premium</div>
                    <div className="text-center">Entreprise</div>
                  </div>
                  <div className="mt-2 grid gap-2 text-sm">
                    <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <div className="text-white/80">Calculateurs de base</div>
                      <div className="text-center text-white/70">Oui</div>
                      <div className="text-center text-white/70">Oui</div>
                      <div className="text-center text-white/70">Oui</div>
                    </div>
                    <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <div className="text-white/80">Calculateurs avancés</div>
                      <div className="text-center text-white/70">Limité</div>
                      <div className="text-center text-white/70">Oui</div>
                      <div className="text-center text-white/70">Oui</div>
                    </div>
                    <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <div className="text-white/80">Export PDF</div>
                      <div className="text-center text-white/70">Non</div>
                      <div className="text-center text-white/70">Oui</div>
                      <div className="text-center text-white/70">Oui</div>
                    </div>
                    <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <div className="text-white/80">Multi-utilisateurs</div>
                      <div className="text-center text-white/70">Non</div>
                      <div className="text-center text-white/70">Non</div>
                      <div className="text-center text-white/70">Oui</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-white/55">Fais glisser horizontalement si besoin.</div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-bold text-white">Inclus</div>
                <div className="mt-2 grid gap-1 text-sm text-white/65">
                  <div>Créer un compte</div>
                  <div>Accéder au dashboard</div>
                  <div>Calculateur béton simple</div>
                  <div>Calculateur acier simple</div>
                  <div>Quelques calculateurs de base</div>
                  <div>Découverte des fonctionnalités chantier</div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm font-bold text-white">Limites</div>
                <div className="mt-2 grid gap-1 text-sm text-white/65">
                  <div>Pas d’export PDF</div>
                  <div>Pas de devis avancés</div>
                  <div>Pas de rapports journaliers</div>
                  <div>Pas d’historique illimité</div>
                  <div>Pas de calculateurs avancés</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button href="/register" size="lg" variant="secondary">
                Commencer gratuitement
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
                <div className="text-sm font-extrabold text-white">Plan Premium</div>
                <span className="rounded-full bg-[var(--cp-accent)]/15 px-2 py-0.5 text-[11px] font-bold text-[var(--cp-accent)] ring-1 ring-[var(--cp-accent)]/30">
                  Premium recommandé
                </span>
              </div>
              <div className="mt-1 text-sm text-white/60">
                Pour les professionnels qui veulent gagner du temps et mieux gérer leurs chantiers
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-sm font-bold text-white">Bénéfices concrets</div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
                  Gagne du temps sur chaque chantier
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
                  Réduis les erreurs de quantité
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
                  Retrouve tous tes calculs par chantier
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
                  Suis les dépenses réelles face au budget prévu
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-bold text-white">Fonctionnalités</div>
                <div className="mt-2 grid gap-1 text-sm text-white/65">
                  <div>Tous les calculateurs avancés</div>
                  <div>Historique des calculs</div>
                  <div>Sauvegarde des calculs par chantier</div>
                  <div>Export PDF (bientôt)</div>
                  <div>Devis générés depuis les calculs (bientôt)</div>
                  <div>Rapports journaliers chantier</div>
                  <div>Outils avancés de suivi</div>
                  <div>Support prioritaire</div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-bold text-white">Offres disponibles</div>
                  <PlanBadge variant="premium" />
                </div>
                <div className="mt-3 grid gap-3">
                  <div>
                    <div className="text-2xl font-extrabold tracking-tight text-white">15 000 FCFA</div>
                    <div className="text-sm text-white/60">par mois</div>
                  </div>
                  <SubscribeButton plan="PREMIUM">Passer à Premium</SubscribeButton>
                  <Button href="/pricing" variant="ghost" size="sm">
                    Voir le détail des plans
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-sm font-bold text-white">Pensé pour le terrain et le bureau</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-sm font-bold text-white">Hommes de terrain</div>
                  <div className="mt-1 text-sm text-white/65">
                    Calculs rapides sur chantier, rapports journaliers et partage simple des résultats.
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-sm font-bold text-white">Bureaux et responsables</div>
                  <div className="mt-1 text-sm text-white/65">
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
                <PlanBadge variant="premium" />
                <div className="text-sm font-extrabold text-white">Plan Entreprise</div>
              </div>
              <div className="mt-1 text-sm text-white/60">
                Pour équipes chantier, bureaux d’études et entreprises BTP
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-bold text-white">Pour les équipes</div>
                <div className="mt-2 grid gap-1 text-sm text-white/65">
                  <div>Multi-utilisateurs</div>
                  <div>Gestion d’équipe</div>
                  <div>Rôles et permissions</div>
                  <div>Suivi multi-chantiers</div>
                  <div>Validation des dépenses</div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm font-bold text-white">Pilotage & exports</div>
                <div className="mt-2 grid gap-1 text-sm text-white/65">
                  <div>Export PDF/Excel</div>
                  <div>Devis avec logo entreprise</div>
                  <div>Dashboard rentabilité</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div>
                <div className="text-2xl font-extrabold tracking-tight text-white">25 000 FCFA</div>
                <div className="text-sm text-white/60">par mois</div>
              </div>
              <div className="mt-3">
                <SubscribeButton plan="ENTERPRISE">Demander une offre</SubscribeButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
