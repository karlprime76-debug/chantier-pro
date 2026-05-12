import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AppShell } from "@/components/layout/AppShell";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { HomeHeroCta } from "@/components/home/HomeHeroCta";
import { InstallAppCard } from "@/components/pwa/InstallAppCard";
import { PlanTabs } from "@/components/subscription/PlanTabs";
import { requireSession } from "@/lib/auth/guards";
import Link from "next/link";
import { cn } from "@/lib/cn";

export default async function Home() {
  const session = await requireSession();
  const isAuthenticated = Boolean(session);

  return (
    <div className="min-h-full">
      <MarketingHeader />
      <AppShell className={isAuthenticated ? "pb-[calc(104px+env(safe-area-inset-bottom))]" : "pb-16"}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <div className="cp-animate-in inline-flex items-center gap-2 rounded-full border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_12%)] px-3 py-1 text-xs font-semibold text-[var(--app-text-muted)]">
              SaaS mobile-first pour le BTP
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--cp-accent)]" />
              MVP
            </div>
            <h1 className="cp-animate-in mt-4 text-3xl font-extrabold tracking-tight text-[var(--app-text)] sm:text-4xl">
              Pilote tes chantiers.
              <br />
              Calcule vite.
              <br />
              Suis tes dépenses.
            </h1>
            <p className="cp-animate-in mt-4 max-w-xl text-base leading-7 text-[var(--app-text-muted)]">
              Chantier Pro aide les professionnels du BTP à centraliser les chantiers, enregistrer les
              calculs béton/acier, suivre les dépenses et produire des rapports journaliers.
            </p>
            <HomeHeroCta />

            <div className="mt-6">
              <InstallAppCard />
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

            <div className="mt-8 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-5">
              <PlanTabs defaultTab="free" />
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
              <div className="grid gap-3">
                <Button href="/dashboard/projects/new" variant="secondary">
                  Nouveau chantier
                </Button>
                <Button href="/dashboard/calculators/concrete" variant="ghost">
                  Calculateur béton
                </Button>
                <Button href="/dashboard/calculators/steel" variant="ghost">
                  Calculateur acier
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </AppShell>
      {isAuthenticated ? <MobileBottomNav /> : null}
      <MarketingFooter />
    </div>
  );
}
