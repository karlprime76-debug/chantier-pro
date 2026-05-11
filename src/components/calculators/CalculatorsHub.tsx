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
import { canAccessFeature, canAccessPlan, type UserPlan } from "@/lib/subscription/access";

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
  return item.status === "AVAILABLE" ? "Disponible" : "Bientôt";
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
      if (planFilter !== "ALL" && c.plan !== planFilter) return false;
      if (categoryFilter !== "ALL" && c.category !== categoryFilter) return false;
      if (!q) return true;
      return (c.title + " " + c.description).toLowerCase().includes(q);
    });
  }, [query, planFilter, categoryFilter]);

  const visibleCountLabel = `${filtered.length} outil${filtered.length > 1 ? "s" : ""}`;

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Centre de calculs Chantier Pro</h1>
        <p className="mt-1 text-sm text-white/60">Tous vos outils de calcul BTP selon votre plan.</p>
        <div className="mt-2 text-xs font-semibold text-white/45">
          Plan actuel: <span className="text-white/70">{planLabel(userPlan)}</span> · {visibleCountLabel}
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
                    "shrink-0 rounded-full px-3 py-2 text-xs font-bold ring-1 ring-white/10 transition",
                    active ? "bg-white/10 text-white" : "bg-black/20 text-white/70 hover:bg-black/30 hover:text-white",
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
                    "shrink-0 rounded-full px-3 py-2 text-xs font-bold ring-1 ring-white/10 transition",
                    active ? "bg-white/10 text-white" : "bg-black/20 text-white/70 hover:bg-black/30 hover:text-white",
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
          const requiredPlanOk = canAccessPlan(userPlan, c.plan);
          const featureOk = c.featureKey ? canAccessFeature(userPlan, c.featureKey) : true;
          const canAccess = requiredPlanOk && featureOk;

          const isEnterpriseLocked = c.plan === "ENTERPRISE" && !canAccessPlan(userPlan, "ENTERPRISE");
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
                      <span className="inline-flex items-center rounded-full bg-black/20 px-2 py-1 text-[11px] font-bold text-white/65 ring-1 ring-white/10">
                        {c.category}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-black/20 px-2 py-1 text-[11px] font-bold text-white/65 ring-1 ring-white/10">
                        {planLabel(c.plan)}
                      </span>
                    </div>
                  </div>
                  <div className="grid justify-items-end gap-2">
                    {c.plan === "FREE" ? <PlanBadge variant="free" /> : <PlanBadge variant="premium" />}
                    <span className="text-[11px] font-bold text-white/55">{statusLabel(c)}</span>
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
                    Contacter pour Entreprise
                  </ResponsiveButton>
                ) : shouldShowUpgrade ? (
                  <ResponsiveButton href="/pricing" prefetch loadingText="Ouverture…" variant="secondary" size="sm">
                    Passer Premium
                  </ResponsiveButton>
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
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="text-sm font-bold text-white">Calculs sauvegardés par chantier</div>
            <div className="mt-1 text-sm text-white/60">Retrouve tous tes calculs par projet, au même endroit.</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="text-sm font-bold text-white">Export PDF professionnel</div>
            <div className="mt-1 text-sm text-white/60">Transforme tes calculs en fiches propres à partager.</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="text-sm font-bold text-white">Devis depuis les calculs</div>
            <div className="mt-1 text-sm text-white/60">Génère rapidement un devis à partir des quantités.</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="text-sm font-bold text-white">Suivi budget chantier</div>
            <div className="mt-1 text-sm text-white/60">Compare budget prévu, dépenses réelles et reste à engager.</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="text-sm font-bold text-white">Rapports journaliers</div>
            <div className="mt-1 text-sm text-white/60">Prépare tes rapports (photos, avancement, observations).</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="text-sm font-bold text-white">Bibliothèque de dosages</div>
            <div className="mt-1 text-sm text-white/60">Accès rapide aux repères terrain et dosages pratiques.</div>
          </div>
        </div>

        <div className="border-t border-white/10 px-6 py-4">
          <div className="text-sm text-white/60">
            <Link href="/pricing" className="font-semibold text-white hover:underline">
              Voir les plans
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
