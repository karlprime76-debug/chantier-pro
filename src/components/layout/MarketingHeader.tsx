import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { MarketingHeaderClient } from "@/components/layout/MarketingHeaderClient";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--app-card-border)] bg-[var(--app-nav-bg)] supports-[backdrop-filter]:backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] ring-1 ring-[var(--app-card-border)]">
            <Image
              src="/logo.png"
              alt="Chantier Pro"
              width={36}
              height={36}
              sizes="36px"
              priority
              className="h-9 w-9 shrink-0 object-contain"
            />
          </div>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-bold text-[var(--app-text)] sm:text-base">Chantier Pro</div>
            <div className="hidden text-[11px] tracking-[0.22em] text-[var(--app-text-muted)] sm:block">BTP</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 sm:flex">
          <Button href="/" variant="ghost" size="sm">
            Accueil
          </Button>
          <Button href="/features" variant="ghost" size="sm">
            Fonctionnalités
          </Button>
          <Button href="/pricing" variant="ghost" size="sm">
            Tarifs
          </Button>
          <Button href="/contact" variant="ghost" size="sm">
            Contact
          </Button>
        </nav>

        <MarketingHeaderClient />
      </div>
    </header>
  );
}
