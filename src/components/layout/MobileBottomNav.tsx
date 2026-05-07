"use client";

import type { ReactNode } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

type MobileNavItem = {
  href: string;
  label: string;
  icon: (props: { className?: string }) => ReactNode;
  isActive?: (pathname: string) => boolean;
};

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 20V5a1 1 0 0 1 1-1h7v16H4Zm8 0V9h7a1 1 0 0 1 1 1v10h-8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M7 8h2M7 11h2M7 14h2M15 13h2M15 16h2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CalculatorIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 7h8M8 12h2M12 12h2M16 12h0M8 16h2M12 16h2M16 16h0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M14 3v4h4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 11h6M9 15h6M9 19h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MoreIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 12h.01M12 12h.01M18 12h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();

  const items: MobileNavItem[] = [
    {
      href: "/",
      label: "Accueil",
      icon: ({ className }) => <HomeIcon className={className} />,
      isActive: (p) => p === "/",
    },
    {
      href: "/dashboard/projects",
      label: "Chantiers",
      icon: ({ className }) => <BuildingIcon className={className} />,
      isActive: (p) => p.startsWith("/dashboard/projects"),
    },
    {
      href: "/calculs",
      label: "Calculs",
      icon: ({ className }) => <CalculatorIcon className={className} />,
      isActive: (p) => p.startsWith("/dashboard/calculators") || p.startsWith("/calculs"),
    },
    {
      href: "/dashboard/quotes",
      label: "Devis",
      icon: ({ className }) => <FileIcon className={className} />,
      isActive: (p) => p.startsWith("/dashboard/quotes"),
    },
    {
      href: "/more",
      label: "Plus",
      icon: ({ className }) => <MoreIcon className={className} />,
      isActive: (p) =>
        p.startsWith("/more") ||
        p === "/dashboard" ||
        p.startsWith("/dashboard/settings") ||
        p.startsWith("/dashboard/expenses") ||
        p.startsWith("/dashboard/reports"),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[rgba(11,15,20,0.84)] backdrop-blur sm:hidden">
      <div className="mx-auto w-full max-w-6xl px-3 pt-2" style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}>
        <div className="grid grid-cols-5 gap-2">
          {items.map((item) => {
            const active = item.isActive ? item.isActive(pathname) : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-[60px] flex-col items-center justify-center gap-1 rounded-2xl px-2 text-center transition",
                  active ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/5 hover:text-white",
                )}
              >
                <span className={cn("h-6 w-6", active ? "text-white" : "text-white/70")}>{item.icon({ className: "h-6 w-6" })}</span>
                <span className="text-[12px] font-semibold leading-none">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
