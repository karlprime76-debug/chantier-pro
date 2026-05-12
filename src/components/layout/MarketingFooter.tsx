import Link from "next/link";

import { AppShell } from "@/components/layout/AppShell";

export function MarketingFooter() {
  return (
    <footer className="border-t border-[var(--app-card-border)] bg-[var(--app-nav-bg)] backdrop-blur">
      <AppShell className="py-6">
        <div className="grid gap-4 sm:grid-cols-2 sm:items-center">
          <div className="text-sm text-[var(--app-text-muted)]">© {new Date().getFullYear()} Chantier Pro • Bénin</div>
          <nav className="flex flex-wrap items-center justify-start gap-x-4 gap-y-2 sm:justify-end">
            <Link className="text-sm text-[var(--app-text-muted)] hover:text-[var(--app-text)]" href="/pricing">
              Tarifs
            </Link>
            <Link className="text-sm text-[var(--app-text-muted)] hover:text-[var(--app-text)]" href="/contact">
              Contact
            </Link>
            <Link className="text-sm text-[var(--app-text-muted)] hover:text-[var(--app-text)]" href="/legal/mentions-legales">
              Mentions légales
            </Link>
            <Link className="text-sm text-[var(--app-text-muted)] hover:text-[var(--app-text)]" href="/legal/confidentialite">
              Confidentialité
            </Link>
            <Link className="text-sm text-[var(--app-text-muted)] hover:text-[var(--app-text)]" href="/legal/conditions">
              Conditions
            </Link>
          </nav>
        </div>
      </AppShell>
    </footer>
  );
}
