import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { HomeClientExtras } from "@/components/home/HomeClientExtras";
import { HomePublicCtas } from "@/components/home/HomePublicCtas";
import Link from "next/link";
import { cn } from "@/lib/cn";

export default function Home() {
  return (
    <div className="min-h-full">
      <MarketingHeader />
      <AppShell className="pb-[calc(104px+env(safe-area-inset-bottom))]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_12%)] px-3 py-1 text-xs font-semibold text-[var(--app-text-muted)]">
              SaaS mobile-first pour le BTP
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--cp-accent)]" />
              Chantier Pro
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--app-text)] sm:text-4xl">
              Gère tes chantiers BTP depuis ton téléphone.
              <br />
              Calcule le béton, l’acier, les dépenses et les rapports journaliers en quelques minutes.
              <br />
              Un suivi clair, du terrain au bureau.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[var(--app-text-muted)]">
              Chantier Pro centralise tes chantiers, automatise les calculs de quantités et t’aide à suivre les coûts et l’avancement,
              directement sur mobile.
            </p>
            <HomePublicCtas variant="hero" />

            <HomeClientExtras />

            <div id="pour-qui" className="mt-8 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-5">
              <div className="text-sm font-bold text-[var(--app-text)]">Pour qui ?</div>
              <div className="mt-3 grid gap-2 text-sm text-[var(--app-text-muted)] sm:grid-cols-2">
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Techniciens génie civil</div>
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Chefs chantier</div>
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Conducteurs travaux</div>
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Petites entreprises BTP</div>
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3 sm:col-span-2">Responsables de suivi chantier</div>
              </div>
            </div>

            <div id="fonctionnalites" className="mt-6 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-5">
              <div className="text-sm font-bold text-[var(--app-text)]">Fonctionnalités clés</div>
              <div className="mt-3 grid gap-2 text-sm text-[var(--app-text-muted)] sm:grid-cols-2">
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Calcul béton</div>
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Calcul acier</div>
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Suivi dépenses</div>
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Budget prévu vs réel</div>
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Rapports journaliers</div>
                <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] p-3">Historique par chantier</div>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <Link
                href="/calculs"
                aria-label="Ouvrir les calculateurs"
                className={cn(
                  "cp-hover-lift rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 transition",
                  "cursor-pointer hover:bg-[color-mix(in_oklab,var(--app-card),transparent_2%)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cp-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]",
                )}
              >
                <div className="text-sm font-bold text-[var(--app-text)]">Calculs</div>
                <div className="mt-1 text-xs text-[var(--app-text-muted)]">Béton & acier</div>
              </Link>

              <Link
                href="/dashboard"
                aria-label="Ouvrir le suivi sur le dashboard"
                className={cn(
                  "cp-hover-lift rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 transition",
                  "cursor-pointer hover:bg-[color-mix(in_oklab,var(--app-card),transparent_2%)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cp-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]",
                )}
              >
                <div className="text-sm font-bold text-[var(--app-text)]">Suivi</div>
                <div className="mt-1 text-xs text-[var(--app-text-muted)]">Budget vs réel</div>
              </Link>

              <Link
                href="/dashboard/reports"
                aria-label="Ouvrir les rapports journaliers"
                className={cn(
                  "cp-hover-lift rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 transition",
                  "cursor-pointer hover:bg-[color-mix(in_oklab,var(--app-card),transparent_2%)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cp-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]",
                )}
              >
                <div className="text-sm font-bold text-[var(--app-text)]">Rapports</div>
                <div className="mt-1 text-xs text-[var(--app-text-muted)]">Journal chantier</div>
              </Link>
            </div>

          </div>

          <div className="lg:col-span-5">
            <Card>
              <CardHeader>
                <CardTitle>Démarrage rapide</CardTitle>
                <CardDescription>
                  Crée un chantier, ajoute les membres, puis enregistre calculs, dépenses et rapports.
                </CardDescription>
              </CardHeader>
              <HomePublicCtas variant="quickstart" />
            </Card>
          </div>
        </div>
      </AppShell>
      <MarketingFooter />
    </div>
  );
}
