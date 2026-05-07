import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { AppShell } from "@/components/layout/AppShell";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { HomeHeroCta } from "@/components/home/HomeHeroCta";
import { PlanTabs } from "@/components/subscription/PlanTabs";
import { requireSession } from "@/lib/auth/guards";

export default async function Home() {
  const session = await requireSession();
  const isAuthenticated = Boolean(session);

  return (
    <div className="min-h-full">
      <MarketingHeader />
      <AppShell className={isAuthenticated ? "pb-[calc(104px+env(safe-area-inset-bottom))]" : "pb-16"}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <div className="cp-animate-in inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/75">
              SaaS mobile-first pour le BTP
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--cp-accent)]" />
              MVP
            </div>
            <h1 className="cp-animate-in mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Pilote tes chantiers.
              <br />
              Calcule vite.
              <br />
              Suis tes dépenses.
            </h1>
            <p className="cp-animate-in mt-4 max-w-xl text-base leading-7 text-white/65">
              Chantier Pro aide les professionnels du BTP à centraliser les chantiers, enregistrer les
              calculs béton/acier, suivre les dépenses et produire des rapports journaliers.
            </p>
            <HomeHeroCta />

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="cp-hover-lift rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-bold text-white">Calculs</div>
                <div className="mt-1 text-xs text-white/55">Béton & acier</div>
              </div>
              <div className="cp-hover-lift rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-bold text-white">Suivi</div>
                <div className="mt-1 text-xs text-white/55">Budget vs réel</div>
              </div>
              <div className="cp-hover-lift rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-bold text-white">Rapports</div>
                <div className="mt-1 text-xs text-white/55">Journal chantier</div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
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
    </div>
  );
}
