"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ResponsiveButton } from "@/components/ui/ResponsiveButton";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PlanBadge } from "@/components/ui/PlanBadge";
import {
  CALCULATORS_CATALOG,
  type CalculatorCatalogItem,
  type CalculatorCategory,
} from "@/lib/calculators/catalog";
import { cn } from "@/lib/cn";
import { FEATURE_MIN_PLAN, canAccessFeature, canAccessPlan, type UserPlan } from "@/lib/subscription/access";

type PlanFilter = "ALL" | UserPlan;

const PLAN_FILTERS: Array<{ id: PlanFilter; label: string }> = [
  { id: "ALL", label: "Tous" },
  { id: "FREE", label: "Gratuit" },
  { id: "PREMIUM", label: "Premium" },
  { id: "ENTERPRISE", label: "Entreprise" },
];

type CategoryFilter = "ALL" | CalculatorCategory;

const CATEGORY_FILTERS: Array<{ id: CategoryFilter; label: string }> = [
  { id: "ALL", label: "Tous" },
  { id: "Béton", label: "Béton" },
  { id: "Acier", label: "Acier" },
  { id: "Maçonnerie", label: "Maçonnerie" },
  { id: "Finition", label: "Finition" },
  { id: "Devis", label: "Devis" },
  { id: "Chantier", label: "Chantier" },
  { id: "Outils Pro", label: "Outils Pro" },
];

function planLabel(plan: UserPlan): string {
  if (plan === "FREE") return "Gratuit";
  if (plan === "PREMIUM") return "Premium";
  return "Entreprise";
}

function statusLabel(item: CalculatorCatalogItem): string {
  if (item.status !== "AVAILABLE") return "Bientôt";
  const requiredPlan = requiredPlanForItem(item);
  if (requiredPlan === "ENTERPRISE") return "Inclus Entreprise";
  if (requiredPlan === "PREMIUM") return "Inclus Premium";
  return "Inclus";
}

function badgeForPlan(plan: UserPlan) {
  if (plan === "FREE") return <PlanBadge variant="free" />;
  if (plan === "PREMIUM") return <PlanBadge variant="premium" />;
  return <PlanBadge variant="free">Entreprise</PlanBadge>;
}

function requiredPlanForItem(item: CalculatorCatalogItem): UserPlan {
  if (item.featureKey) return FEATURE_MIN_PLAN[item.featureKey];
  return item.plan;
}

type CalculatorsHubProps = {
  userPlan: UserPlan;
};

function withPlan(href: string, userPlan: UserPlan) {
  if (!href.startsWith("/")) return href;
  const sep = href.includes("?") ? "&" : "?";
  return `${href}${sep}plan=${encodeURIComponent(userPlan)}`;
}

export function CalculatorsHub({ userPlan }: CalculatorsHubProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<PlanFilter>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("ALL");

  useEffect(() => {
    const routesToPrefetch = [
      "/calculs/devis",
      "/calculs/budget-chantier",
      "/calculs/rapports-journaliers",
      "/calculs/bibliotheque-dosages",
      "/calculs/bibliotheque-prix",
      "/calculs/rentabilite-chantier",
      "/calculs/exports-avances",
      "/calculs/suivi-equipe",
      "/calculs/validation-depenses",
      "/pricing",
    ];

    routesToPrefetch.forEach((href) => {
      router.prefetch(href);
    });
  }, [router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return CALCULATORS_CATALOG.filter((c) => {
      const requiredPlan = requiredPlanForItem(c);
      if (planFilter !== "ALL" && requiredPlan !== planFilter) return false;
      if (categoryFilter !== "ALL" && c.category !== categoryFilter) return false;
      if (!q) return true;
      return (c.title + " " + c.description).toLowerCase().includes(q);
    });
  }, [query, planFilter, categoryFilter]);

  const visibleCountLabel = `${filtered.length} outil${filtered.length > 1 ? "s" : ""}`;

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--app-text)]">Centre de calculs Chantier Pro</h1>
        <p className="mt-1 text-sm text-[var(--app-text-muted)]">Tous vos outils de calcul BTP selon votre plan.</p>
        <div className="mt-2 text-xs font-semibold text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">
          Plan actuel: <span className="text-[var(--app-text)]">{planLabel(userPlan)}</span> · {visibleCountLabel}
        </div>
      </div>

      <div className="grid gap-3">
        <Input
          label="Rechercher un calculateur"
          name="calculatorSearch"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="grid gap-2">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {PLAN_FILTERS.map((f) => {
              const active = f.id === planFilter;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setPlanFilter(f.id)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-2 text-xs font-bold ring-1 transition",
                    "ring-[var(--app-card-border)]",
                    active
                      ? "bg-[color-mix(in_oklab,var(--app-text),transparent_92%)] text-[var(--app-text)]"
                      : "bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] text-[var(--app-text-muted)] hover:bg-[color-mix(in_oklab,var(--app-text),transparent_94%)] hover:text-[var(--app-text)]",
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORY_FILTERS.map((f) => {
              const active = f.id === categoryFilter;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setCategoryFilter(f.id)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-2 text-xs font-bold ring-1 transition",
                    "ring-[var(--app-card-border)]",
                    active
                      ? "bg-[color-mix(in_oklab,var(--app-text),transparent_92%)] text-[var(--app-text)]"
                      : "bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] text-[var(--app-text-muted)] hover:bg-[color-mix(in_oklab,var(--app-text),transparent_94%)] hover:text-[var(--app-text)]",
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((c) => {
          const requiredPlan = requiredPlanForItem(c);
          const requiredPlanOk = canAccessPlan(userPlan, requiredPlan);
          const featureOk = c.featureKey ? canAccessFeature(userPlan, c.featureKey) : true;
          const canAccess = requiredPlanOk && featureOk;

          const needsEnterprise = requiredPlan === "ENTERPRISE";
          const isEnterpriseLocked = needsEnterprise && !canAccessPlan(userPlan, "ENTERPRISE");
          const shouldShowUpgrade = !isEnterpriseLocked && !canAccess;

          return (
            <Card key={c.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle>
                      <span className="mr-2" aria-hidden="true">
                        {c.iconName}
                      </span>
                      {c.title}
                    </CardTitle>
                    <CardDescription>{c.description}</CardDescription>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-full bg-[color-mix(in_oklab,var(--app-card),transparent_12%)] px-2 py-1 text-[11px] font-bold text-[var(--app-text-muted)] ring-1 ring-[var(--app-card-border)]">
                        {c.category}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-[color-mix(in_oklab,var(--app-card),transparent_12%)] px-2 py-1 text-[11px] font-bold text-[var(--app-text-muted)] ring-1 ring-[var(--app-card-border)]">
                        {planLabel(requiredPlan)}
                      </span>
                    </div>
                  </div>
                  <div className="grid justify-items-end gap-2">
                    {badgeForPlan(requiredPlan)}
                    <span className="text-[11px] font-bold text-[var(--app-text-muted)]">{statusLabel(c)}</span>
                  </div>
                </div>
              </CardHeader>

              <div className="px-6 pb-6">
                {c.status !== "AVAILABLE" ? (
                  <ResponsiveButton type="button" variant="ghost" size="sm" disabled>
                    Bientôt
                  </ResponsiveButton>
                ) : canAccess ? (
                  <ResponsiveButton
                    href={withPlan(c.href, userPlan)}
                    prefetch
                    loadingText="Ouverture…"
                    variant="secondary"
                    size="sm"
                  >
                    Ouvrir
                  </ResponsiveButton>
                ) : isEnterpriseLocked ? (
                  <ResponsiveButton href="/pricing" prefetch loadingText="Ouverture…" variant="secondary" size="sm">
                    Passer à Entreprise
                  </ResponsiveButton>
                ) : shouldShowUpgrade ? (
                  needsEnterprise ? (
                    <ResponsiveButton href="/pricing" prefetch loadingText="Ouverture…" variant="secondary" size="sm">
                      Passer à Entreprise
                    </ResponsiveButton>
                  ) : (
                    <ResponsiveButton href="/pricing" prefetch loadingText="Ouverture…" variant="secondary" size="sm">
                      Passer à Premium
                    </ResponsiveButton>
                  )
                ) : (
                  <ResponsiveButton href="/pricing" prefetch loadingText="Ouverture…" variant="secondary" size="sm">
                    Voir les offres
                  </ResponsiveButton>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Pourquoi passer à Chantier Pro Premium ?</CardTitle>
            <PlanBadge variant="premium" />
          </div>
          <CardDescription>Des bénéfices concrets pour le terrain et le bureau.</CardDescription>
        </CardHeader>

        <div className="grid gap-3 px-6 pb-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
            <div className="text-sm font-bold text-[var(--app-text)]">Calculs sauvegardés par chantier</div>
            <div className="mt-1 text-sm text-[var(--app-text-muted)]">Retrouve tous tes calculs par projet, au même endroit.</div>
          </div>
          <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
            <div className="text-sm font-bold text-[var(--app-text)]">Export PDF professionnel</div>
            <div className="mt-1 text-sm text-[var(--app-text-muted)]">Transforme tes calculs en fiches propres à partager.</div>
          </div>
          <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
            <div className="text-sm font-bold text-[var(--app-text)]">Devis depuis les calculs</div>
            <div className="mt-1 text-sm text-[var(--app-text-muted)]">Génère rapidement un devis à partir des quantités.</div>
          </div>
          <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
            <div className="text-sm font-bold text-[var(--app-text)]">Suivi budget chantier</div>
            <div className="mt-1 text-sm text-[var(--app-text-muted)]">Compare budget prévu, dépenses réelles et reste à engager.</div>
          </div>
          <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
            <div className="text-sm font-bold text-[var(--app-text)]">Rapports journaliers</div>
            <div className="mt-1 text-sm text-[var(--app-text-muted)]">Prépare tes rapports (photos, avancement, observations).</div>
          </div>
          <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
            <div className="text-sm font-bold text-[var(--app-text)]">Bibliothèque de dosages</div>
            <div className="mt-1 text-sm text-[var(--app-text-muted)]">Accès rapide aux repères terrain et dosages pratiques.</div>
          </div>
        </div>

        <div className="border-t border-[var(--app-card-border)] px-6 py-4">
          <div className="text-sm text-[var(--app-text-muted)]">
            <Link href="/pricing" className="font-semibold text-[var(--app-text)] hover:underline">
              Voir les plans
            </Link>
            <span className="mx-2 text-[color-mix(in_oklab,var(--app-text),transparent_70%)]">·</span>
            <span className="text-[var(--app-text-muted)]">Passe au niveau pro pour débloquer tous les outils.</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
