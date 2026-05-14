import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { NewReportForm } from "@/components/reports/NewReportForm";
import { prisma } from "@/lib/db/prisma";
import { requireSession } from "@/lib/auth/guards";

export default async function ReportsPage() {
  const session = await requireSession();
  const user = session
    ? await prisma.user.findUnique({ where: { id: session.id }, select: { companyId: true } })
    : null;

  const reports: Array<{
    id: string;
    date: Date;
    weather: string | null;
    workersCount: number | null;
    workDone: string;
    progressEst: number | null;
    project: { id: string; name: string };
  }> = user?.companyId
    ? await prisma.dailyReport.findMany({
        where: { project: { companyId: user.companyId } },
        orderBy: { date: "desc" },
        take: 30,
        select: {
          id: true,
          date: true,
          weather: true,
          workersCount: true,
          workDone: true,
          progressEst: true,
          project: { select: { id: true, name: true } },
        },
      })
    : [];

  const recentCount = reports.length;

  return (
    <div className="grid gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--app-text)]">Rapports</h1>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">Rapports journaliers et suivi terrain.</p>
          <div className="mt-2 text-xs font-semibold text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">
            {recentCount} rapport(s) récent(s)
          </div>
        </div>
        <div className="hidden sm:flex gap-2">
          <Button href="#new-report" variant="primary">
            Créer un rapport
          </Button>
          <Button href="/dashboard/projects" variant="secondary">
            Voir les chantiers
          </Button>
        </div>
      </div>

      <div id="new-report">
        <Card className="cp-hover-lift">
          <CardHeader>
            <CardTitle>Nouveau rapport</CardTitle>
            <CardDescription>Météo, ouvriers, travaux réalisés, incidents.</CardDescription>
          </CardHeader>

          <NewReportForm />
        </Card>
      </div>

      <Card className="cp-hover-lift">
        <CardHeader>
          <CardTitle>Derniers rapports</CardTitle>
          <CardDescription>{reports.length} rapport(s)</CardDescription>
        </CardHeader>
        <div className="grid gap-2">
          {reports.length === 0 ? (
            <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
              Aucun rapport.
            </div>
          ) : (
            reports.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-[var(--app-text)]">{r.project.name}</div>
                    <div className="mt-1 text-xs text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">
                      {new Date(r.date).toLocaleDateString("fr-FR")} • {r.weather ?? "—"} • Ouvriers:{" "}
                      {r.workersCount ?? "—"} • Avancement: {r.progressEst ?? "—"}%
                    </div>
                    <div className="mt-2 text-sm text-[var(--app-text-muted)]">{r.workDone}</div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-[color-mix(in_oklab,var(--app-primary),transparent_86%)] px-2.5 py-1 text-[11px] font-extrabold text-[var(--app-primary)] ring-1 ring-[var(--app-card-border)]">
                        En cours
                      </span>
                      {r.weather ? (
                        <span className="inline-flex items-center rounded-full bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] px-2.5 py-1 text-[11px] font-extrabold text-[var(--app-text-muted)] ring-1 ring-[var(--app-card-border)]">
                          Météo: {r.weather}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <Button href={`/dashboard/projects/${r.project.id}`} variant="ghost" size="sm">
                    Chantier
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
