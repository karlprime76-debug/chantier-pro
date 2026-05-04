import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { prisma } from "@/lib/db/prisma";
import { requireSession } from "@/lib/auth/guards";

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  const session = await requireSession();
  const user = session
    ? await prisma.user.findUnique({ where: { id: session.id }, select: { companyId: true } })
    : null;

  const project = user?.companyId
    ? await prisma.project.findFirst({
        where: { id: projectId, companyId: user.companyId },
        select: {
          id: true,
          name: true,
          clientName: true,
          location: true,
          projectType: true,
          estimatedBudget: true,
          status: true,
          progress: true,
          createdAt: true,
          _count: {
            select: {
              expenses: true,
              dailyReports: true,
              quotes: true,
              concreteCalculations: true,
              steelCalculations: true,
            },
          },
        },
      })
    : null;

  if (!project) {
    return (
      <div className="grid gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">Chantier introuvable</h1>
            <p className="mt-1 text-sm text-white/60">Projet inaccessible ou supprimé.</p>
          </div>
          <Button href="/dashboard/projects" variant="ghost">
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">{project.name}</h1>
          <p className="mt-1 text-sm text-white/60">
            {project.location ? project.location : "Localisation non définie"}
          </p>
        </div>
        <Button href="/dashboard/projects" variant="ghost">
          Retour
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Résumé</CardTitle>
            <CardDescription>Infos générales + statut + budget.</CardDescription>
          </CardHeader>
          <div className="grid gap-2 text-sm text-white/70">
            <div>
              <span className="text-white/55">Statut:</span> {project.status}
            </div>
            <div>
              <span className="text-white/55">Avancement:</span> {project.progress}%
            </div>
            <div>
              <span className="text-white/55">Client:</span> {project.clientName ?? "—"}
            </div>
            <div>
              <span className="text-white/55">Type:</span> {project.projectType ?? "—"}
            </div>
            <div>
              <span className="text-white/55">Budget estimé:</span>{" "}
              {project.estimatedBudget ? String(project.estimatedBudget) : "—"}
            </div>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Accès rapide aux modules liés.</CardDescription>
          </CardHeader>
          <div className="grid gap-2">
            <Button href="/dashboard/calculators/concrete" variant="secondary">
              Nouveau calcul béton
            </Button>
            <Button href="/dashboard/calculators/steel" variant="secondary">
              Nouveau calcul acier
            </Button>
            <Button href="/dashboard/expenses" variant="ghost">
              Ajouter une dépense
            </Button>
            <Button href="/dashboard/reports" variant="ghost">
              Ajouter un rapport
            </Button>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique</CardTitle>
          <CardDescription>
            Dépenses: {project._count.expenses} • Rapports: {project._count.dailyReports} • Devis:{" "}
            {project._count.quotes} • Béton: {project._count.concreteCalculations} • Acier:{" "}
            {project._count.steelCalculations}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
