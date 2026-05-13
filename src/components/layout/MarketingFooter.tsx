import Link from "next/link";

import { AppShell } from "@/components/layout/AppShell";
import { SITE_CONFIG } from "@/lib/site-config";

export function MarketingFooter() {
  return (
    <footer className="border-t border-[var(--app-card-border)] bg-[var(--app-nav-bg)] supports-[backdrop-filter]:backdrop-blur">
      <AppShell className="py-6">
        <div className="grid gap-4 sm:grid-cols-2 sm:items-center">
          <div className="grid gap-2 text-sm text-[var(--app-text-muted)]">
            <div>
              © {new Date().getFullYear()} {SITE_CONFIG.name} • {SITE_CONFIG.country}
            </div>
            <div>
              Contact :{" "}
              <a className="hover:text-[var(--app-text)]" href={`mailto:${SITE_CONFIG.email}`}>
                {SITE_CONFIG.email}
              </a>
            </div>
            <div>
              WhatsApp :{" "}
              <a className="hover:text-[var(--app-text)]" href={SITE_CONFIG.whatsappUrl} target="_blank" rel="noreferrer">
                {SITE_CONFIG.whatsappDisplay}
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <a
                className="hover:text-[var(--app-text)]"
                href={SITE_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Suivre Chantier Pro sur Instagram"
              >
                Instagram
              </a>
              <span aria-hidden="true">•</span>
              <a
                className="hover:text-[var(--app-text)]"
                href={SITE_CONFIG.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Suivre Chantier Pro sur TikTok"
              >
                TikTok
              </a>
            </div>
          </div>
          <nav className="flex flex-wrap items-center justify-start gap-x-4 gap-y-2 sm:justify-end">
            <Link className="text-sm text-[var(--app-text-muted)] hover:text-[var(--app-text)]" href="/pricing">
              Tarifs
            </Link>
            <Link className="text-sm text-[var(--app-text-muted)] hover:text-[var(--app-text)]" href="/use-cases">
              Cas d’usage
            </Link>
            <Link className="text-sm text-[var(--app-text-muted)] hover:text-[var(--app-text)]" href="/demo">
              Démo
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
