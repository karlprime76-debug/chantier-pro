import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { prisma } from "@/lib/db/prisma";
import { requireSession } from "@/lib/auth/guards";

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
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-white/60">Aperçu rapide de ton activité chantier.</p>
        </div>
        <div className="hidden sm:flex gap-2">
          <Button href="/dashboard/projects/new" variant="secondary">
            Nouveau chantier
          </Button>
          <Button href="/dashboard/reports" variant="ghost">
            Nouveau rapport
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Chantiers actifs</CardTitle>
            <CardDescription>{activeProjectsCount}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dépenses totales</CardTitle>
            <CardDescription>{expensesAgg._sum.amount ? `${String(expensesAgg._sum.amount)} FCFA` : "0 FCFA"}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Derniers rapports</CardTitle>
            <CardDescription>{lastReports.length}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Alertes</CardTitle>
            <CardDescription>Aucune</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Budget prévu vs réel</CardTitle>
            <CardDescription>Calcul simple : budget estimé par chantier vs dépenses.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Derniers calculs</CardTitle>
            <CardDescription>Béton / acier sauvegardés par chantier.</CardDescription>
          </CardHeader>
          <div className="grid gap-2">
            {lastReports.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
                Aucun rapport récent.
              </div>
            ) : (
              lastReports.map((r) => (
                <div key={r.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="text-sm font-semibold text-white">{r.project.name}</div>
                  <div className="mt-1 text-xs text-white/55">
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
