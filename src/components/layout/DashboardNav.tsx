"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

const items = [
  { href: "/", label: "Accueil" },
  { href: "/dashboard", label: "Aperçu" },
  { href: "/dashboard/projects", label: "Chantiers" },
  { href: "/dashboard/expenses", label: "Dépenses" },
  { href: "/dashboard/reports", label: "Rapports" },
  { href: "/dashboard/quotes", label: "Devis" },
  { href: "/dashboard/settings", label: "Réglages" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[rgba(11,15,20,0.84)] backdrop-blur sm:hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-7 gap-1 px-2 py-2">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-xl px-2 py-2 text-center text-[11px] font-semibold transition",
                active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white",
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
