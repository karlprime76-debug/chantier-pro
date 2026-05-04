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

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Rapports journaliers</h1>
        <p className="mt-1 text-sm text-white/60">Traçabilité quotidienne par chantier.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nouveau rapport</CardTitle>
          <CardDescription>Météo, ouvriers, travaux réalisés, incidents.</CardDescription>
        </CardHeader>

        <NewReportForm />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Derniers rapports</CardTitle>
          <CardDescription>{reports.length} rapport(s)</CardDescription>
        </CardHeader>
        <div className="grid gap-2">
          {reports.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
              Aucun rapport.
            </div>
          ) : (
            reports.map((r) => (
              <div key={r.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-white">{r.project.name}</div>
                    <div className="mt-1 text-xs text-white/55">
                      {new Date(r.date).toLocaleDateString("fr-FR")} • {r.weather ?? "—"} • Ouvriers:{" "}
                      {r.workersCount ?? "—"} • Avancement: {r.progressEst ?? "—"}%
                    </div>
                    <div className="mt-2 text-sm text-white/70">{r.workDone}</div>
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
