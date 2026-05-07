"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PlanBadge } from "@/components/ui/PlanBadge";
import { cn } from "@/lib/cn";

type CalculatorCategory =
  | "Tous"
  | "Béton"
  | "Acier"
  | "Maçonnerie"
  | "Finition"
  | "Terrassement"
  | "Devis"
  | "Outils Pro";

type CalculatorStatus = "Disponible" | "Bientôt" | "Premium";

type CalculatorCard = {
  title: string;
  description: string;
  category: Exclude<CalculatorCategory, "Tous">;
  href: string;
  planBadge: "free" | "premium" | "soon";
  status: CalculatorStatus;
};

const FILTERS: CalculatorCategory[] = [
  "Tous",
  "Béton",
  "Acier",
  "Maçonnerie",
  "Finition",
  "Devis",
  "Outils Pro",
];

const CALCULATORS: CalculatorCard[] = [
  {
    title: "Béton (simple)",
    description: "Volume + marge de perte + estimation matériaux.",
    category: "Béton",
    href: "/dashboard/calculators/concrete",
    planBadge: "free",
    status: "Disponible",
  },
  {
    title: "Béton (escalier)",
    description: "Bientôt: escalier béton dédié.",
    category: "Béton",
    href: "/dashboard/calculators/stairs/straight",
    planBadge: "soon",
    status: "Bientôt",
  },
  {
    title: "Acier (simple)",
    description: "Calcul simple d’acier (MVP).",
    category: "Acier",
    href: "/dashboard/calculators/steel",
    planBadge: "free",
    status: "Disponible",
  },
  {
    title: "Poids acier",
    description: "Poids total selon diamètre et longueur.",
    category: "Acier",
    href: "/dashboard/calculators/steel-weight",
    planBadge: "free",
    status: "Disponible",
  },
  {
    title: "Agglos / Briques",
    description: "Surface de mur + nombre de blocs + perte.",
    category: "Maçonnerie",
    href: "/dashboard/calculators/masonry-blocks",
    planBadge: "free",
    status: "Disponible",
  },
  {
    title: "Maçonnerie (avancé)",
    description: "Premium: blocs, mortier, surfaces et ouvertures.",
    category: "Maçonnerie",
    href: "/dashboard/calculators/masonry",
    planBadge: "premium",
    status: "Premium",
  },
  {
    title: "Carrelage",
    description: "Estimation carreaux + cartons + chutes.",
    category: "Finition",
    href: "/dashboard/calculators/tiling",
    planBadge: "premium",
    status: "Premium",
  },
  {
    title: "Peinture",
    description: "Surfaces, couches, rendement et litres.",
    category: "Finition",
    href: "/dashboard/calculators/paint",
    planBadge: "free",
    status: "Disponible",
  },
  {
    title: "Devis",
    description: "Devis simple (PDF plus tard).",
    category: "Devis",
    href: "/dashboard/quotes",
    planBadge: "free",
    status: "Disponible",
  },
  {
    title: "Mémo dosages",
    description: "Bientôt: repères terrain (dosages, rendements).",
    category: "Outils Pro",
    href: "/more",
    planBadge: "soon",
    status: "Bientôt",
  },
];

function statusLabel(status: CalculatorStatus): string {
  if (status === "Disponible") return "Disponible";
  if (status === "Premium") return "Premium";
  return "Bientôt";
}

export function CalculatorsHub() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CalculatorCategory>("Tous");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return CALCULATORS.filter((c) => {
      if (filter !== "Tous" && c.category !== filter) return false;
      if (!q) return true;
      return (c.title + " " + c.description).toLowerCase().includes(q);
    });
  }, [query, filter]);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Calculs</h1>
        <p className="mt-1 text-sm text-white/60">Centre de calcul Chantier Pro: terrain + bureau.</p>
      </div>

      <div className="grid gap-3">
        <Input
          label="Rechercher un calculateur"
          name="calculatorSearch"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => {
            const active = f === filter;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-2 text-xs font-bold ring-1 ring-white/10 transition",
                  active ? "bg-white/10 text-white" : "bg-black/20 text-white/70 hover:bg-black/30 hover:text-white",
                )}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((c) => (
          <Card key={c.href}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle>{c.title}</CardTitle>
                  <CardDescription>{c.description}</CardDescription>
                </div>
                <div className="grid justify-items-end gap-2">
                  <PlanBadge variant={c.planBadge} />
                  <span className="text-[11px] font-bold text-white/55">{statusLabel(c.status)}</span>
                </div>
              </div>
            </CardHeader>

            <div className="px-6 pb-6">
              {c.status === "Disponible" ? (
                <Button href={c.href} variant="secondary" size="sm">
                  Ouvrir
                </Button>
              ) : c.status === "Premium" ? (
                <div className="flex items-center gap-2">
                  <Button href={c.href} variant="secondary" size="sm">
                    Ouvrir
                  </Button>
                  <Button href="/pricing" variant="ghost" size="sm">
                    Passer Premium
                  </Button>
                </div>
              ) : (
                <Button type="button" variant="ghost" size="sm" disabled>
                  Bientôt
                </Button>
              )}
            </div>
          </Card>
        ))}
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
