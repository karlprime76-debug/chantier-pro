import Link from "next/link";

import { cn } from "@/lib/cn";

const mainItems = [
  { href: "/dashboard", label: "Aperçu" },
  { href: "/dashboard/projects", label: "Chantiers" },
  { href: "/dashboard/expenses", label: "Dépenses" },
  { href: "/dashboard/reports", label: "Rapports" },
  { href: "/dashboard/quotes", label: "Devis" },
  { href: "/dashboard/settings", label: "Réglages" },
];

const calculatorFreeItems = [
  { href: "/dashboard/calculators/concrete", label: "Béton simple" },
  { href: "/dashboard/calculators/steel", label: "Acier simple" },
];

const calculatorProItems = [
  { href: "/dashboard/calculators/stairs/straight", label: "Escalier droit" },
  { href: "/dashboard/calculators/stairs/landing", label: "Escalier avec palier" },
  { href: "/dashboard/calculators/formwork", label: "Coffrage" },
  { href: "/dashboard/calculators/masonry", label: "Maçonnerie" },
  { href: "/dashboard/calculators/plaster", label: "Enduit" },
  { href: "/dashboard/calculators/tiling", label: "Carrelage" },
  { href: "/dashboard/calculators/painting", label: "Peinture" },
  { href: "/dashboard/calculators/roofing", label: "Toiture" },
  { href: "/dashboard/calculators/earthwork", label: "Terrassement" },
];

const calculatorEnterpriseItems = [
  { href: "/dashboard/calculators/stairs/quarter-turn", label: "Escalier quart tournant" },
  { href: "/dashboard/calculators/septic-tank", label: "Fosse septique / Puisard" },
  { href: "/dashboard/calculators/fence", label: "Clôture complète" },
  { href: "/dashboard/calculators/slab/advanced", label: "Dalle pleine avancée" },
];

type DashboardSidebarProps = {
  activeHref?: string;
};

export function DashboardSidebar({ activeHref }: DashboardSidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 sm:block">
      <div className="sticky top-6 rounded-2xl border border-white/10 bg-white/5 p-3">
        <div className="mb-3 px-3 py-2">
          <div className="text-sm font-bold text-white">Chantier Pro</div>
          <div className="text-xs text-white/55">MVP</div>
        </div>

        <nav className="flex flex-col gap-1">
          <Link
            href="/"
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-semibold transition",
              "text-white/70 hover:bg-white/5 hover:text-white",
            )}
          >
            Accueil
          </Link>

          {mainItems.map((item) => {
            const active = activeHref ? activeHref === item.href : false;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-semibold transition",
                  active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="mt-3 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white/40">
            Calculateurs gratuits
          </div>
          {calculatorFreeItems.map((item) => {
            const active = activeHref ? activeHref === item.href : false;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-semibold transition",
                  active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="mt-3 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white/40">
            Calculateurs Pro
          </div>
          {calculatorProItems.map((item) => {
            const active = activeHref ? activeHref === item.href : false;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-semibold transition",
                  active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="mt-3 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white/40">
            Premium / Entreprise
          </div>
          {calculatorEnterpriseItems.map((item) => {
            const active = activeHref ? activeHref === item.href : false;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-semibold transition",
                  active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
