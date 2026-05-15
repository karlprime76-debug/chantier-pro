import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/cn";

const mainItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/projects", label: "Chantiers" },
  { href: "/dashboard/expenses", label: "Dépenses" },
  { href: "/dashboard/reports", label: "Documents / Rapports" },
  { href: "/dashboard/quotes", label: "Devis" },
  { href: "/dashboard/calculators", label: "Calculateurs" },
  { href: "/pricing", label: "Abonnement / Tarifs" },
  { href: "/dashboard/settings", label: "Réglages" },
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
        </nav>
      </div>
    </aside>
  );
}
