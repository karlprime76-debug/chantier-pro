"use client";

import { useState } from "react";
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

type MobileNavAction = {
  id: string;
  label: string;
  icon: (props: { className?: string }) => ReactNode;
  onClick: () => void;
  isActive?: (pathname: string) => boolean;
};

function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M20 21a8 8 0 1 0-16 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 13a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 13a1 1 0 0 1 1-1h6v8H5a1 1 0 0 1-1-1v-6Zm10-9h5a1 1 0 0 1 1 1v7h-6V4Zm0 10h6v5a1 1 0 0 1-1 1h-5v-6ZM4 5a1 1 0 0 1 1-1h6v6H4V5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DotsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 12h0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M12 12h0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M18 12h0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
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

export function MobileBottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const items: MobileNavItem[] = [
    {
      href: "/",
      label: "Accueil",
      icon: ({ className }) => <HomeIcon className={className} />,
      isActive: (p) => p === "/",
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: ({ className }) => <DashboardIcon className={className} />,
      isActive: (p) => p === "/dashboard",
    },
    {
      href: "/dashboard/projects",
      label: "Chantiers",
      icon: ({ className }) => <BuildingIcon className={className} />,
      isActive: (p) => p.startsWith("/dashboard/projects"),
    },
    {
      href: "/dashboard/calculators",
      label: "Calculateurs",
      icon: ({ className }) => <CalculatorIcon className={className} />,
      isActive: (p) => p.startsWith("/dashboard/calculators") || p === "/dashboard/calculators",
    },
  ];

  const moreAction: MobileNavAction = {
    id: "more",
    label: "Plus",
    icon: ({ className }) => <DotsIcon className={className} />,
    onClick: () => setMoreOpen((v) => !v),
    isActive: (p) => p.startsWith("/dashboard/reports") || p.startsWith("/dashboard/settings"),
  };

  const activeIndex = [...items, moreAction].findIndex((item) => {
    const ok = item.isActive ? item.isActive(pathname) : (item as MobileNavItem).href === pathname;
    return ok;
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden" aria-label="Navigation principale">
      <div
        className="relative mx-auto w-full max-w-6xl px-3"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        {moreOpen ? (
          <div className="absolute bottom-[calc(0.75rem+env(safe-area-inset-bottom)+78px)] left-1/2 z-50 w-[min(92vw,360px)] -translate-x-1/2">
            <div className="rounded-3xl border border-[color-mix(in_oklab,var(--app-nav-bg),white_12%)] bg-[var(--app-nav-bg)] p-2 shadow-lg supports-[backdrop-filter]:backdrop-blur">
              <Link
                href="/dashboard/reports"
                prefetch={false}
                onClick={() => setMoreOpen(false)}
                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-[var(--app-text)] hover:bg-[color-mix(in_oklab,var(--app-text),transparent_94%)]"
              >
                <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] ring-1 ring-[var(--app-card-border)]">
                  <FileIcon className="h-6 w-6" />
                </span>
                <span>Docs / Rapports</span>
              </Link>

              <Link
                href="/dashboard/settings"
                prefetch={false}
                onClick={() => setMoreOpen(false)}
                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-[var(--app-text)] hover:bg-[color-mix(in_oklab,var(--app-text),transparent_94%)]"
              >
                <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] ring-1 ring-[var(--app-card-border)]">
                  <UserIcon className="h-6 w-6" />
                </span>
                <span>Compte</span>
              </Link>
            </div>
          </div>
        ) : null}

        <div
          className={cn(
            "relative mx-auto grid grid-cols-5 gap-1 rounded-3xl border p-2 shadow-lg supports-[backdrop-filter]:backdrop-blur",
            "bg-[var(--app-nav-bg)] border-[color-mix(in_oklab,var(--app-nav-bg),white_12%)]",
          )}
        >
          {items.map((item, idx) => {
            const active = idx === activeIndex;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                aria-current={active ? "page" : undefined}
                onClick={() => setMoreOpen(false)}
                className={cn(
                  "flex h-[62px] flex-col items-center justify-center gap-1 rounded-2xl px-2 text-center select-none touch-manipulation transition duration-150 will-change-transform active:scale-[0.96] active:opacity-90",
                  active
                    ? "bg-[color-mix(in_oklab,var(--app-primary),transparent_82%)] text-[var(--app-primary)]"
                    : "text-[color-mix(in_oklab,white,transparent_24%)] hover:bg-[color-mix(in_oklab,white,transparent_92%)] hover:text-white",
                )}
              >
                <span
                  className={cn(
                    "grid h-7 w-7 place-items-center",
                    active ? "text-[var(--app-primary)]" : "text-[color-mix(in_oklab,white,transparent_24%)]",
                  )}
                >
                  {item.icon({ className: "h-6 w-6" })}
                </span>
                <span className="text-[12px] font-semibold leading-none">{item.label}</span>
              </Link>
            );
          })}

          {(() => {
            const active = items.length === activeIndex;
            return (
              <button
                type="button"
                aria-current={active ? "page" : undefined}
                onClick={moreAction.onClick}
                className={cn(
                  "flex h-[62px] flex-col items-center justify-center gap-1 rounded-2xl px-2 text-center select-none touch-manipulation transition duration-150 will-change-transform active:scale-[0.96] active:opacity-90",
                  active
                    ? "bg-[color-mix(in_oklab,var(--app-primary),transparent_82%)] text-[var(--app-primary)]"
                    : "text-[color-mix(in_oklab,white,transparent_24%)] hover:bg-[color-mix(in_oklab,white,transparent_92%)] hover:text-white",
                )}
              >
                <span
                  className={cn(
                    "grid h-7 w-7 place-items-center",
                    active ? "text-[var(--app-primary)]" : "text-[color-mix(in_oklab,white,transparent_24%)]",
                  )}
                >
                  {moreAction.icon({ className: "h-6 w-6" })}
                </span>
                <span className="text-[12px] font-semibold leading-none">{moreAction.label}</span>
              </button>
            );
          })()}
        </div>
      </div>
    </nav>
  );
}
