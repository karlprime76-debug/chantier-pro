"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

const items = [
  { href: "/", label: "Accueil" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/projects", label: "Chantiers" },
  { href: "/dashboard/expenses", label: "Dépenses" },
  { href: "/dashboard/reports", label: "Rapports" },
  { href: "/dashboard/quotes", label: "Devis" },
  { href: "/dashboard/settings", label: "Réglages" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--app-card-border)] bg-[var(--app-nav-bg)] backdrop-blur sm:hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-7 gap-1 px-2 py-2">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-xl px-2 py-2 text-center text-[11px] font-semibold transition",
                active
                  ? "bg-[color-mix(in_oklab,var(--app-primary),transparent_86%)] text-[var(--app-primary)]"
                  : "text-[var(--app-text-muted)] hover:bg-[color-mix(in_oklab,var(--app-text),transparent_94%)] hover:text-[var(--app-text)]",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
