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
      href: "/dashboard/reports",
      label: "Documents",
      icon: ({ className }) => <FileIcon className={className} />,
      isActive: (p) => p.startsWith("/dashboard/reports"),
    },
    {
      href: "/dashboard/settings",
      label: "Profil",
      icon: ({ className }) => <UserIcon className={className} />,
      isActive: (p) => p.startsWith("/dashboard/settings"),
    },
  ];

  const activeIndex = items.findIndex((item) => {
    const ok = item.isActive ? item.isActive(pathname) : pathname === item.href;
    return ok;
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden" aria-label="Navigation principale">
      <div
        className="mx-auto w-full max-w-6xl px-3"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <div
          className={cn(
            "mx-auto grid grid-cols-5 gap-1 rounded-3xl border p-2 shadow-lg supports-[backdrop-filter]:backdrop-blur",
            "bg-[var(--app-nav-bg)] border-[var(--app-card-border)]",
          )}
        >
          {items.map((item) => {
            const active = items.indexOf(item) === activeIndex;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-[62px] flex-col items-center justify-center gap-1 rounded-2xl px-2 text-center select-none touch-manipulation transition duration-150 will-change-transform active:scale-[0.96] active:opacity-90",
                  active
                    ? "bg-[color-mix(in_oklab,var(--app-primary),transparent_86%)] text-[var(--app-primary)]"
                    : "text-[var(--app-text-muted)] hover:bg-[color-mix(in_oklab,var(--app-text),transparent_94%)] hover:text-[var(--app-text)]",
                )}
              >
                <span
                  className={cn(
                    "grid h-7 w-7 place-items-center",
                    active ? "text-[var(--app-primary)]" : "text-[var(--app-text-muted)]",
                  )}
                >
                  {item.icon({ className: "h-6 w-6" })}
                </span>
                <span className="text-[12px] font-semibold leading-none">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
