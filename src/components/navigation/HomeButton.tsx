"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import * as React from "react";

import { cn } from "@/lib/cn";

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

const HIDE_ON_PREFIXES = ["/login", "/register", "/forgot-password", "/reset-password"];

export function HomeButton() {
  const pathname = usePathname();
  const { status } = useSession();

  const hidden = pathname === "/" || HIDE_ON_PREFIXES.some((p) => pathname.startsWith(p));
  if (hidden) return null;

  const href = status === "authenticated" ? "/dashboard" : "/";

  return (
    <div
      className={cn(
        "fixed right-3 top-3 z-[60] sm:right-6 sm:top-6",
        "[padding-top:env(safe-area-inset-top)]",
      )}
    >
      <Link
        href={href}
        prefetch
        aria-label="Accueil"
        className={cn(
          "grid h-11 w-11 place-items-center rounded-full border border-[var(--app-card-border)]",
          "bg-[color-mix(in_oklab,var(--app-card),transparent_25%)] backdrop-blur shadow-lg",
          "text-[color-mix(in_oklab,var(--app-text),transparent_15%)] hover:text-[var(--app-text)]",
          "select-none touch-manipulation transition duration-150 will-change-transform",
          "active:scale-[0.96] active:opacity-90",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]",
        )}
      >
        <HomeIcon className="h-5 w-5" />
      </Link>
    </div>
  );
}
