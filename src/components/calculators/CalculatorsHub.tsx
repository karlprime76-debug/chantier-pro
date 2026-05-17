"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

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

type CategoryFilter = "ALL" | CalculatorCategory;

const CATEGORY_FILTERS: Array<{ id: CategoryFilter; label: string }> = [
  { id: "ALL", label: "Tous" },
  { id: "Béton", label: "Béton" },
  { id: "Acier / Ferraillage", label: "Acier / Ferraillage" },
  { id: "Maçonnerie", label: "Maçonnerie" },
  { id: "Finitions", label: "Finitions" },
  { id: "Toiture", label: "Toiture" },
  { id: "Fondations", label: "Fondations" },
  { id: "Dalles / Planchers", label: "Dalles / Planchers" },
  { id: "Escaliers", label: "Escaliers" },
  { id: "Coffrage", label: "Coffrage" },
  { id: "Terrassement", label: "Terrassement" },
  { id: "Laboratoire / Contrôle qualité", label: "Laboratoire / Contrôle qualité" },
  { id: "Documents / Rapports", label: "Documents / Rapports" },
  { id: "Outils Entreprise", label: "Outils Entreprise" },
];

function planLabel(plan: UserPlan): string {
  if (plan === "FREE") return "Gratuit";
  if (plan === "PREMIUM") return "Pro";
  return "Entreprise";
}

function statusLabel(item: CalculatorCatalogItem): string {
  if (item.status !== "AVAILABLE") return "Bientôt";
  const requiredPlan = requiredPlanForItem(item);
  if (requiredPlan === "ENTERPRISE") return "Inclus dans Entreprise";
  if (requiredPlan === "PREMIUM") return "Inclus dans Pro";
  return "Inclus";
}

function badgeForPlan(plan: UserPlan) {
  if (plan === "FREE") return <PlanBadge variant="free" />;
  if (plan === "PREMIUM") return <PlanBadge variant="premium" />;
  return <PlanBadge variant="enterprise" />;
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
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("ALL");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return CALCULATORS_CATALOG.filter((c) => {
      if (categoryFilter !== "ALL" && c.category !== categoryFilter) return false;
      if (!q) return true;
      return (c.title + " " + c.description).toLowerCase().includes(q);
    });
  }, [query, categoryFilter]);

  const grouped = useMemo(() => {
    const byPlan: Record<UserPlan, CalculatorCatalogItem[]> = {
      FREE: [],
      PREMIUM: [],
      ENTERPRISE: [],
    };

    for (const c of filtered) {
      const requiredPlan = requiredPlanForItem(c);
      byPlan[requiredPlan].push(c);
    }

    (Object.keys(byPlan) as UserPlan[]).forEach((p) => {
      byPlan[p] = byPlan[p].sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
    });

    return byPlan;
  }, [filtered]);

  const visibleCountLabel = `${filtered.length} outil${filtered.length > 1 ? "s" : ""}`;

  function renderCalculatorCard(c: CalculatorCatalogItem) {
    const requiredPlan = requiredPlanForItem(c);
    const requiredPlanOk = canAccessPlan(userPlan, requiredPlan);
    const featureOk = c.featureKey ? canAccessFeature(userPlan, c.featureKey) : true;
    const canAccess = requiredPlanOk && featureOk;

    const needsEnterprise = requiredPlan === "ENTERPRISE";
    const isEnterpriseLocked = needsEnterprise && !canAccessPlan(userPlan, "ENTERPRISE");
    const shouldShowUpgrade = !isEnterpriseLocked && !canAccess;

    return (
      <Card key={c.id} className="cp-hover-lift overflow-hidden">
        <CardHeader className="mb-0">
          <div className="flex min-w-0 items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[color-mix(in_oklab,var(--cp-accent-2),white_88%)] text-[var(--cp-accent-2)] ring-1 ring-[var(--app-card-border)]">
              <span className="text-lg" aria-hidden="true">
                {c.iconName}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <CardTitle className="text-base">
                <span className="line-clamp-2 break-words">{c.title}</span>
              </CardTitle>
              <CardDescription className="line-clamp-2">{c.description}</CardDescription>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] px-2.5 py-1 text-[11px] font-extrabold text-[var(--app-text-muted)] ring-1 ring-[var(--app-card-border)]">
                  {c.category}
                </span>

                {badgeForPlan(requiredPlan)}

                <span className="inline-flex items-center rounded-full bg-[color-mix(in_oklab,var(--app-text),transparent_92%)] px-2.5 py-1 text-[11px] font-extrabold text-[var(--app-text)] ring-1 ring-[var(--app-card-border)] whitespace-nowrap">
                  {statusLabel(c)}
                </span>

                {c.status !== "AVAILABLE" ? (
                  <span className="inline-flex items-center rounded-full bg-[color-mix(in_oklab,var(--app-text),transparent_92%)] px-2.5 py-1 text-[11px] font-extrabold text-[var(--app-text-muted)] ring-1 ring-[var(--app-card-border)] whitespace-nowrap">
                    Bientôt
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </CardHeader>

        <div className="mt-4 border-t border-[var(--app-card-border)] px-6 py-4">
          {c.status !== "AVAILABLE" ? (
            <ResponsiveButton type="button" variant="ghost" size="md" disabled className="w-full">
              Bientôt
            </ResponsiveButton>
          ) : canAccess ? (
            <ResponsiveButton
              href={withPlan(c.href, userPlan)}
              prefetch
              loadingText="Ouverture…"
              variant="secondary"
              size="md"
              className="w-full"
            >
              Ouvrir
            </ResponsiveButton>
          ) : isEnterpriseLocked ? (
            <ResponsiveButton href="/pricing" prefetch loadingText="Ouverture…" variant="secondary" size="md" className="w-full">
              Passer à Entreprise
            </ResponsiveButton>
          ) : shouldShowUpgrade ? (
            needsEnterprise ? (
              <ResponsiveButton href="/pricing" prefetch loadingText="Ouverture…" variant="secondary" size="md" className="w-full">
                Passer à Entreprise
              </ResponsiveButton>
            ) : (
              <ResponsiveButton href="/pricing" prefetch loadingText="Ouverture…" variant="secondary" size="md" className="w-full">
                Passer à Pro
              </ResponsiveButton>
            )
          ) : (
            <ResponsiveButton href="/pricing" prefetch loadingText="Ouverture…" variant="secondary" size="md" className="w-full">
              Voir les offres
            </ResponsiveButton>
          )}
        </div>
      </Card>
    );
  }

  function sectionCta(plan: UserPlan) {
    if (plan === "FREE") return null;

    const hasAccess = canAccessPlan(userPlan, plan);
    if (hasAccess) {
      const label = userPlan === plan ? "Inclus dans votre plan" : "Accessible avec votre plan";
      return (
        <span className="inline-flex items-center rounded-full bg-[color-mix(in_oklab,var(--app-text),transparent_92%)] px-3 py-1 text-xs font-extrabold text-[var(--app-text)] ring-1 ring-[var(--app-card-border)]">
          {label}
        </span>
      );
    }

    return (
      <Link
        href="/pricing"
        className="inline-flex items-center rounded-full bg-[color-mix(in_oklab,var(--app-primary),transparent_86%)] px-3 py-1 text-xs font-extrabold text-[var(--app-primary)] ring-1 ring-[color-mix(in_oklab,var(--app-primary),transparent_55%)] hover:bg-[color-mix(in_oklab,var(--app-primary),transparent_82%)]"
      >
        {plan === "ENTERPRISE" ? "Passer à Entreprise" : "Passer à Pro"}
      </Link>
    );
  }

  function sectionDescription(plan: UserPlan) {
    if (plan === "FREE") return "Outils essentiels accessibles à tous.";
    if (plan === "PREMIUM") return "Outils avancés pour aller plus loin sur vos chantiers.";
    return "Outils complets pour les besoins avancés des entreprises et grands projets.";
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--app-text)] sm:text-3xl">
          Calculateurs
        </h1>
        <p className="mt-1 text-sm text-[var(--app-text-muted)]">
          Vos modules BTP, organisés par catégorie, selon votre plan.
        </p>
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
            {CATEGORY_FILTERS.map((f) => {
              const active = f.id === categoryFilter;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setCategoryFilter(f.id)}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2 text-xs font-extrabold ring-1 transition",
                    "ring-[var(--app-card-border)] shadow-sm",
                    active
                      ? "bg-[color-mix(in_oklab,var(--cp-accent-2),white_88%)] text-[var(--cp-accent-2)]"
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

      <div className="grid gap-6">
        {(["FREE", "PREMIUM", "ENTERPRISE"] as UserPlan[]).map((plan) => {
          const items = grouped[plan];
          const countLabel = `${items.length} outil${items.length > 1 ? "s" : ""}`;

          return (
            <Card key={plan} className="overflow-hidden">
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base sm:text-lg">{planLabel(plan)}</CardTitle>
                      {badgeForPlan(plan)}
                    </div>
                    <CardDescription>
                      {sectionDescription(plan)} · <span className="font-semibold text-[var(--app-text)]">{countLabel}</span>
                    </CardDescription>
                  </div>

                  <div className="shrink-0">{sectionCta(plan)}</div>
                </div>
              </CardHeader>

              <div className="grid gap-3 px-6 pb-6 sm:grid-cols-2">
                {items.length ? (
                  items.map((c) => renderCalculatorCard(c))
                ) : (
                  <div className="sm:col-span-2 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
                    Aucun outil dans cette section avec les filtres actuels.
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Pourquoi passer au plan Pro ?</CardTitle>
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
