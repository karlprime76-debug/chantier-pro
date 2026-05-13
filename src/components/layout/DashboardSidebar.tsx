import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/cn";
import { PlanBadge } from "@/components/ui/PlanBadge";

const mainItems = [
  { href: "/dashboard", label: "Dashboard" },
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
  { href: "/dashboard/calculators/fondations", label: "Fondations" },
  { href: "/dashboard/calculators/formulation-beton", label: "Formulation béton" },
];

type DashboardSidebarProps = {
  activeHref?: string;
};

export function DashboardSidebar({ activeHref }: DashboardSidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 sm:block">
      <div className="sticky top-6 rounded-2xl border border-[var(--app-card-border)] bg-[var(--app-card)] p-3">
        <div className="mb-3 flex items-center gap-3 px-3 py-2">
          <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] ring-1 ring-[var(--app-card-border)]">
            <Image src="/logo.png" alt="Chantier Pro" width={40} height={40} className="h-10 w-10 object-contain" />
          </div>
          <div>
            <div className="text-sm font-bold text-[var(--app-text)]">Chantier Pro</div>
            <div className="text-xs text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">MVP</div>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          <Link
            href="/"
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-semibold transition",
              "text-[var(--app-text-muted)] hover:bg-[color-mix(in_oklab,var(--app-text),transparent_94%)] hover:text-[var(--app-text)]",
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
                  active
                    ? "bg-[color-mix(in_oklab,var(--app-text),transparent_92%)] text-[var(--app-text)]"
                    : "text-[var(--app-text-muted)] hover:bg-[color-mix(in_oklab,var(--app-text),transparent_94%)] hover:text-[var(--app-text)]",
                )}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="mt-3 flex items-center justify-between gap-3 px-3 py-2">
            <div className="text-xs font-bold uppercase tracking-wide text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Calculateurs</div>
            <PlanBadge variant="free" />
          </div>
          {calculatorFreeItems.map((item) => {
            const active = activeHref ? activeHref === item.href : false;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-semibold transition",
                  active
                    ? "bg-[color-mix(in_oklab,var(--app-text),transparent_92%)] text-[var(--app-text)]"
                    : "text-[var(--app-text-muted)] hover:bg-[color-mix(in_oklab,var(--app-text),transparent_94%)] hover:text-[var(--app-text)]",
                )}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="mt-3 flex items-center justify-between gap-3 px-3 py-2">
            <div className="text-xs font-bold uppercase tracking-wide text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Calculateurs</div>
            <PlanBadge variant="premium" />
          </div>
          {calculatorProItems.map((item) => {
            const active = activeHref ? activeHref === item.href : false;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-semibold transition",
                  active
                    ? "bg-[color-mix(in_oklab,var(--app-text),transparent_92%)] text-[var(--app-text)]"
                    : "text-[var(--app-text-muted)] hover:bg-[color-mix(in_oklab,var(--app-text),transparent_94%)] hover:text-[var(--app-text)]",
                )}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="mt-3 flex items-center justify-between gap-3 px-3 py-2">
            <div className="text-xs font-bold uppercase tracking-wide text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Entreprise</div>
            <PlanBadge variant="premium" />
          </div>
          {calculatorEnterpriseItems.map((item) => {
            const active = activeHref ? activeHref === item.href : false;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-semibold transition",
                  active
                    ? "bg-[color-mix(in_oklab,var(--app-text),transparent_92%)] text-[var(--app-text)]"
                    : "text-[var(--app-text-muted)] hover:bg-[color-mix(in_oklab,var(--app-text),transparent_94%)] hover:text-[var(--app-text)]",
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
