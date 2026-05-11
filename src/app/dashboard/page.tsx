import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { InstallAppCard } from "@/components/pwa/InstallAppCard";
import { prisma } from "@/lib/db/prisma";
import { requireSession } from "@/lib/auth/guards";

function StatIcon({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={
        className ??
        "grid h-11 w-11 place-items-center rounded-2xl bg-[color-mix(in_oklab,var(--cp-accent-2),white_88%)] text-[var(--cp-accent-2)] ring-1 ring-[var(--cp-border)]"
      }
    >
      {children}
    </div>
  );
}

function MiniIcon({ path, className }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? "h-6 w-6"} aria-hidden="true">
      <path d={path} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function DashboardPage() {
  const session = await requireSession();
  const user = session
    ? await prisma.user.findUnique({ where: { id: session.id }, select: { companyId: true } })
    : null;

  const companyId = user?.companyId ?? null;

  const activeProjectsCount = companyId
    ? await prisma.project.count({ where: { companyId, status: "ACTIVE" } })
    : 0;

  const expensesAgg = companyId
    ? await prisma.expense.aggregate({
        where: { project: { companyId } },
        _sum: { amount: true },
      })
    : { _sum: { amount: null } };

  const lastReports: Array<{ id: string; date: Date; project: { id: string; name: string } }> = companyId
    ? await prisma.dailyReport.findMany({
        where: { project: { companyId } },
        orderBy: { date: "desc" },
        take: 3,
        select: { id: true, date: true, project: { select: { id: true, name: true } } },
      })
    : [];

  return (
    <div className="grid gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-[color-mix(in_oklab,var(--cp-text),transparent_35%)]">Bonjour,</div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--cp-text)] sm:text-3xl">
            Bienvenue sur Chantier Pro
          </h1>
          <p className="mt-2 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_45%)]">
            Ton tableau de bord chantier, calculs et documents — en un coup d’œil.
          </p>
        </div>
        <div className="hidden sm:flex gap-2">
          <Button href="/dashboard/projects/new" variant="primary">
            Nouveau chantier
          </Button>
          <Button href="/dashboard/reports" variant="secondary">
            Nouveau document
          </Button>
        </div>
      </div>

      <InstallAppCard />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="cp-hover-lift">
          <CardHeader className="mb-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-base">Projets</CardTitle>
                <div className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--cp-text)]">{activeProjectsCount}</div>
                <CardDescription className="mt-1">Chantiers actifs</CardDescription>
              </div>
              <StatIcon>
                <MiniIcon path="M4 20V5a1 1 0 0 1 1-1h7v16H4Zm8 0V9h7a1 1 0 0 1 1 1v10h-8Z" />
              </StatIcon>
            </div>
          </CardHeader>
        </Card>

        <Card className="cp-hover-lift">
          <CardHeader className="mb-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-base">Dépenses</CardTitle>
                <div className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--cp-text)]">
                  {expensesAgg._sum.amount ? `${String(expensesAgg._sum.amount)}` : "0"}
                </div>
                <CardDescription className="mt-1">FCFA au total</CardDescription>
              </div>
              <StatIcon className="grid h-11 w-11 place-items-center rounded-2xl bg-[color-mix(in_oklab,var(--cp-accent),white_88%)] text-[var(--cp-accent)] ring-1 ring-[var(--cp-border)]">
                <MiniIcon path="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />
              </StatIcon>
            </div>
          </CardHeader>
        </Card>

        <Card className="cp-hover-lift">
          <CardHeader className="mb-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-base">Documents</CardTitle>
                <div className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--cp-text)]">{lastReports.length}</div>
                <CardDescription className="mt-1">Rapports récents</CardDescription>
              </div>
              <StatIcon>
                <MiniIcon path="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z M14 3v4h4" />
              </StatIcon>
            </div>
          </CardHeader>
        </Card>

        <Card className="cp-hover-lift">
          <CardHeader className="mb-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-base">Avancement</CardTitle>
                <div className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--cp-text)]">—</div>
                <CardDescription className="mt-1">Vue globale (bientôt)</CardDescription>
              </div>
              <StatIcon>
                <MiniIcon path="M4 18V6 M4 18h16 M8 14l3-3 3 2 4-5" />
              </StatIcon>
            </div>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="cp-hover-lift">
          <CardHeader>
            <CardTitle>Calculs rapides</CardTitle>
            <CardDescription>Lance un calcul en 1 tap.</CardDescription>
          </CardHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button href="/dashboard/calculators/concrete" variant="secondary" className="justify-start">
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[color-mix(in_oklab,var(--cp-accent),transparent_86%)] text-[var(--cp-accent)] ring-1 ring-[var(--cp-border)]">
                <MiniIcon path="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" className="h-5 w-5" />
              </span>
              Béton
            </Button>
            <Button href="/dashboard/calculators/steel" variant="secondary" className="justify-start">
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[color-mix(in_oklab,var(--cp-accent-2),white_88%)] text-[var(--cp-accent-2)] ring-1 ring-[var(--cp-border)]">
                <MiniIcon path="M4 7h16M4 12h16M4 17h16" className="h-5 w-5" />
              </span>
              Ferraillage
            </Button>
            <Button href="/calculs" variant="secondary" className="justify-start">
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[color-mix(in_oklab,var(--cp-text),transparent_92%)] text-[var(--cp-text)] ring-1 ring-[var(--cp-border)]">
                <MiniIcon path="M8 7h8M8 12h2M12 12h2M8 16h2M12 16h2" className="h-5 w-5" />
              </span>
              Tous les calculs
            </Button>
            <Button href="/dashboard/projects" variant="secondary" className="justify-start">
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[color-mix(in_oklab,var(--cp-accent),transparent_90%)] text-[var(--cp-accent)] ring-1 ring-[var(--cp-border)]">
                <MiniIcon path="M3 7h18M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" className="h-5 w-5" />
              </span>
              Projets
            </Button>
          </div>
        </Card>

        <Card className="cp-hover-lift">
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
            <CardDescription>Derniers rapports de chantier.</CardDescription>
          </CardHeader>
          <div className="grid gap-2">
            {lastReports.length === 0 ? (
              <div className="rounded-2xl border border-[var(--cp-border)] bg-[color-mix(in_oklab,var(--cp-card),transparent_8%)] p-4 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_45%)]">
                Aucun rapport récent.
              </div>
            ) : (
              lastReports.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-[var(--cp-border)] bg-[color-mix(in_oklab,var(--cp-card),transparent_8%)] p-4"
                >
                  <div className="text-sm font-semibold text-[var(--cp-text)]">{r.project.name}</div>
                  <div className="mt-1 text-xs text-[color-mix(in_oklab,var(--cp-text),transparent_45%)]">
                    Rapport du {new Date(r.date).toLocaleDateString("fr-FR")}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
