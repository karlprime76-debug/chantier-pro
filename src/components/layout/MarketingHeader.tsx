import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { MarketingHeaderAuth } from "@/components/layout/MarketingHeaderAuth";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(11,15,20,0.72)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10">
            <Image src="/logo.png" alt="Chantier Pro" width={36} height={36} className="h-9 w-9 object-contain" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-white sm:text-base">Chantier Pro</div>
            <div className="hidden text-[11px] tracking-[0.22em] text-white/55 sm:block">BTP</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 sm:flex">
          <Button href="/" variant="ghost" size="sm">
            Accueil
          </Button>
          <Button href="/pricing" variant="ghost" size="sm">
            Tarifs
          </Button>
          <Button href="/dashboard" variant="ghost" size="sm">
            Dashboard
          </Button>
        </nav>

        <MarketingHeaderAuth />
      </div>
    </header>
  );
}
