import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { prisma } from "@/lib/db/prisma";
import { requireSession } from "@/lib/auth/guards";

export default async function ProjectsPage() {
  const session = await requireSession();
  const user = session
    ? await prisma.user.findUnique({ where: { id: session.id }, select: { companyId: true } })
    : null;

  const projects: Array<{
    id: string;
    name: string;
    status: string;
    progress: number;
    clientName: string | null;
  }> = user?.companyId
    ? await prisma.project.findMany({
        where: { companyId: user.companyId },
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, status: true, progress: true, clientName: true },
      })
    : [];

  return (
    <div className="grid gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Chantiers</h1>
          <p className="mt-1 text-sm text-white/60">Tous tes projets en cours et terminés.</p>
        </div>
        <Button href="/dashboard/projects/new" variant="secondary">
          Nouveau
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des chantiers</CardTitle>
          <CardDescription>{projects.length} chantier(s)</CardDescription>
        </CardHeader>
        <div className="grid gap-3">
          {projects.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="text-sm font-semibold text-white">Aucun chantier</div>
              <div className="mt-1 text-sm text-white/60">
                Crée ton premier chantier pour commencer le suivi.
              </div>
              <div className="mt-4">
                <Button href="/dashboard/projects/new" variant="secondary" size="sm">
                  Créer un chantier
                </Button>
              </div>
            </div>
          ) : (
            projects.map((p) => (
              <div key={p.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-white">{p.name}</div>
                    <div className="mt-1 text-xs text-white/55">
                      Statut: {p.status} • Avancement: {p.progress}%
                      {p.clientName ? ` • Client: ${p.clientName}` : ""}
                    </div>
                  </div>
                  <Button href={`/dashboard/projects/${p.id}`} variant="ghost" size="sm">
                    Ouvrir
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
