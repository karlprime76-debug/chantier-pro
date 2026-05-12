import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { prisma } from "@/lib/db/prisma";
import { requireSession } from "@/lib/auth/guards";
import type { ReactNode } from "react";

function formatDateFr(value: Date | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("fr-FR");
}

function parseDecimalToNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = Number(String(value));
  return Number.isFinite(n) ? n : null;
}

function formatFcfa(value: number | null) {
  if (value === null) return "—";
  return `${Math.round(value).toLocaleString("fr-FR")} FCFA`;
}

function formatNumber(value: number | null, digits = 2) {
  if (value === null) return "—";
  return value.toLocaleString("fr-FR", { maximumFractionDigits: digits });
}

function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  const cls =
    tone === "success"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"
      : tone === "warning"
        ? "border-amber-500/20 bg-amber-500/10 text-amber-800 dark:text-amber-200"
        : tone === "danger"
          ? "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-200"
          : "border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] text-[var(--app-text-muted)]";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}>
      {children}
    </span>
  );
}

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
          startDate: true,
          plannedEndDate: true,
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
              straightStairCalculations: true,
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
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--app-text)]">Chantier introuvable</h1>
            <p className="mt-1 text-sm text-[var(--app-text-muted)]">Projet inaccessible ou supprimé.</p>
          </div>
          <Button href="/dashboard/projects" variant="ghost">
            Retour
          </Button>
        </div>
      </div>
    );
  }

  const budget = parseDecimalToNumber(project.estimatedBudget);

  const expensesAgg = await prisma.expense.aggregate({
    where: { projectId: project.id },
    _sum: { amount: true },
  });
  const totalExpenses = parseDecimalToNumber(expensesAgg._sum.amount);
  const remaining = budget !== null && totalExpenses !== null ? budget - totalExpenses : null;
  const delta = budget !== null && totalExpenses !== null ? totalExpenses - budget : null;
  const consumedPct =
    budget !== null && totalExpenses !== null && budget > 0 ? Math.round((totalExpenses / budget) * 100) : null;
  const overBudget = budget !== null && totalExpenses !== null ? totalExpenses > budget : false;

  const recentExpenses = await prisma.expense.findMany({
    where: { projectId: project.id },
    orderBy: { date: "desc" },
    take: 5,
    select: {
      id: true,
      category: true,
      label: true,
      supplier: true,
      amount: true,
      date: true,
      status: true,
    },
  });

  const recentReports = await prisma.dailyReport.findMany({
    where: { projectId: project.id },
    orderBy: { date: "desc" },
    take: 3,
    select: {
      id: true,
      date: true,
      weather: true,
      workersCount: true,
      workDone: true,
      progressEst: true,
    },
  });

  const recentQuotes = await prisma.quote.findMany({
    where: { projectId: project.id },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      title: true,
      clientName: true,
      status: true,
      total: true,
      createdAt: true,
    },
  });

  const recentStraightStair = await prisma.straightStairCalculation.findMany({
    where: { projectId: project.id },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      createdAt: true,
      stepsCount: true,
      riserHeightCm: true,
      treadDepthCm: true,
      comfortFormulaValue: true,
      comfortStatus: true,
      concreteVolumeWithLossM3: true,
      formworkAreaM2: true,
      estimatedCost: true,
    },
  });

  const recentConcrete = await prisma.concreteCalculation.findMany({
    where: { projectId: project.id },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      createdAt: true,
      elementType: true,
      volumeWithWaste: true,
      cementEstimateKg: true,
      sandEstimateM3: true,
      gravelEstimateM3: true,
    },
  });

  const recentSteel = await prisma.steelCalculation.findMany({
    where: { projectId: project.id },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      createdAt: true,
      diameterMm: true,
      totalLengthM: true,
      totalWeightKg: true,
      bars12mCount: true,
      estimatedCost: true,
    },
  });

  return (
    <div className="grid gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-extrabold tracking-tight text-[var(--app-text)]">{project.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge
              tone={
                project.status === "ACTIVE"
                  ? "success"
                  : project.status === "ON_HOLD"
                    ? "warning"
                    : project.status === "CANCELLED"
                      ? "danger"
                      : "neutral"
              }
            >
              {project.status}
            </Badge>
            <Badge tone="neutral">Avancement {project.progress}%</Badge>
            {project.clientName ? <Badge tone="neutral">Client {project.clientName}</Badge> : null}
          </div>

          <div className="mt-2 text-sm text-[var(--app-text-muted)]">
            {project.location ? project.location : "Localisation non définie"}
            {project.projectType ? ` • ${project.projectType}` : ""}
          </div>
        </div>
        <Button href="/dashboard/projects" variant="ghost">
          Retour
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Header chantier</CardTitle>
            <CardDescription>Informations principales du chantier.</CardDescription>
          </CardHeader>
          <div className="grid gap-2 text-sm text-[var(--app-text-muted)]">
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Statut:</span> {project.status}
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Avancement:</span> {project.progress}%
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Client:</span> {project.clientName ?? "—"}
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Type:</span> {project.projectType ?? "—"}
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Budget estimé:</span>{" "}
              {budget !== null ? formatFcfa(budget) : "—"}
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Début:</span> {formatDateFr(project.startDate)}
            </div>
            <div>
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Fin prévue:</span> {formatDateFr(project.plannedEndDate)}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Résumé financier</CardTitle>
            <CardDescription>Budget vs dépenses (estimation).</CardDescription>
          </CardHeader>
          <div className="grid gap-2 text-sm text-[var(--app-text-muted)]">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Dépenses totales</span>
              <span className="font-semibold text-[var(--app-text)]">{formatFcfa(totalExpenses)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Reste théorique</span>
              <span className="font-semibold text-[var(--app-text)]">{formatFcfa(remaining)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Écart budget</span>
              <span className={`font-semibold ${overBudget ? "text-rose-700 dark:text-rose-200" : "text-[var(--app-text)]"}`}>
                {formatFcfa(delta)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">% consommé</span>
              <span className={`font-semibold ${overBudget ? "text-rose-700 dark:text-rose-200" : "text-[var(--app-text)]"}`}>
                {consumedPct !== null ? `${consumedPct}%` : "—"}
              </span>
            </div>

            {overBudget ? (
              <div className="mt-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-200">
                Alerte: les dépenses dépassent le budget estimé.
              </div>
            ) : null}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>Créer / ajouter rapidement depuis ce chantier.</CardDescription>
        </CardHeader>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <Button href="/dashboard/expenses" variant="secondary">
            Ajouter une dépense
          </Button>
          <Button href="/dashboard/reports" variant="secondary">
            Créer un rapport journalier
          </Button>
          <Button href={`/dashboard/calculators/concrete?projectId=${project.id}`} variant="ghost">
            Faire un calcul béton
          </Button>
          <Button href={`/dashboard/calculators/steel?projectId=${project.id}`} variant="ghost">
            Faire un calcul acier
          </Button>
          <Button href={`/dashboard/calculators/stairs/straight?projectId=${project.id}`} variant="ghost">
            Faire un calcul escalier droit
          </Button>
          <Button href="/dashboard/quotes" variant="ghost">
            Créer un devis
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calculs sauvegardés</CardTitle>
            <CardDescription>Derniers calculs liés au chantier.</CardDescription>
          </CardHeader>
          <div className="grid gap-3">
            <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[var(--app-text)]">Escalier droit</div>
                  <div className="mt-1 text-xs text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">{project._count.straightStairCalculations} calcul(s)</div>
                </div>
                <Badge tone="neutral">PRO</Badge>
              </div>

              {recentStraightStair.length === 0 ? (
                <div className="mt-3 text-sm text-[var(--app-text-muted)]">Aucun calcul escalier sauvegardé pour le moment.</div>
              ) : (
                <div className="mt-3 grid gap-2">
                  {recentStraightStair.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_12%)] p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-xs text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">{formatDateFr(c.createdAt)}</div>
                        <Badge
                          tone={
                            c.comfortStatus === "ok" || c.comfortStatus === "OK"
                              ? "success"
                            : c.comfortStatus === "warning" || c.comfortStatus === "WARNING"
                              ? "warning"
                              : "neutral"
                          }
                        >
                          {c.comfortStatus}
                        </Badge>
                      </div>
                      <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                        <div>
                          <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Marches:</span> {c.stepsCount} •{" "}
                          <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">H:</span> {formatNumber(parseDecimalToNumber(c.riserHeightCm), 1)} cm •{" "}
                          <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">G:</span> {formatNumber(parseDecimalToNumber(c.treadDepthCm), 1)} cm
                        </div>
                        <div>
                          <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">2H+G:</span>{" "}
                          {formatNumber(parseDecimalToNumber(c.comfortFormulaValue), 1)}
                        </div>
                        <div>
                          <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Béton (avec perte):</span>{" "}
                          {formatNumber(parseDecimalToNumber(c.concreteVolumeWithLossM3), 3)} m³ •{" "}
                          <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Coffrage:</span> {formatNumber(parseDecimalToNumber(c.formworkAreaM2), 2)} m²
                        </div>
                        <div>
                          <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Coût estimatif:</span>{" "}
                          {formatFcfa(parseDecimalToNumber(c.estimatedCost))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
              <div className="text-sm font-bold text-[var(--app-text)]">Béton</div>
              {recentConcrete.length === 0 ? (
                <div className="mt-1 text-sm text-[var(--app-text-muted)]">Aucun calcul béton sauvegardé pour le moment.</div>
              ) : (
                <div className="mt-3 grid gap-2">
                  {recentConcrete.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_12%)] p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-xs text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">{formatDateFr(c.createdAt)}</div>
                        <Badge tone="neutral">{c.elementType}</Badge>
                      </div>
                      <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                        <div>
                          <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Volume (avec perte):</span>{" "}
                          {formatNumber(parseDecimalToNumber(c.volumeWithWaste), 3)} m³
                        </div>
                        <div>
                          <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Ciment:</span> {formatNumber(parseDecimalToNumber(c.cementEstimateKg), 0)} kg
                        </div>
                        <div>
                          <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Sable:</span> {formatNumber(parseDecimalToNumber(c.sandEstimateM3), 3)} m³ •{" "}
                          <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Gravier:</span> {formatNumber(parseDecimalToNumber(c.gravelEstimateM3), 3)} m³
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
              <div className="text-sm font-bold text-[var(--app-text)]">Acier</div>
              {recentSteel.length === 0 ? (
                <div className="mt-1 text-sm text-[var(--app-text-muted)]">Aucun calcul acier sauvegardé pour le moment.</div>
              ) : (
                <div className="mt-3 grid gap-2">
                  {recentSteel.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_12%)] p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-xs text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">{formatDateFr(s.createdAt)}</div>
                        <Badge tone="neutral">HA{s.diameterMm}</Badge>
                      </div>
                      <div className="mt-2 grid gap-1 text-sm text-[var(--app-text-muted)]">
                        <div>
                          <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Longueur:</span> {formatNumber(parseDecimalToNumber(s.totalLengthM), 3)} m
                        </div>
                        <div>
                          <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Poids:</span> {formatNumber(parseDecimalToNumber(s.totalWeightKg), 3)} kg •{" "}
                          <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Barres 12m:</span> {s.bars12mCount ?? "—"}
                        </div>
                        <div>
                          <span className="text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Coût estimatif:</span> {formatFcfa(parseDecimalToNumber(s.estimatedCost))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dépenses récentes</CardTitle>
            <CardDescription>{project._count.expenses} dépense(s) enregistrée(s)</CardDescription>
          </CardHeader>
          <div className="grid gap-2">
            {recentExpenses.length === 0 ? (
              <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
                Aucune dépense pour le moment.
              </div>
            ) : (
              recentExpenses.map((e) => (
                <div key={e.id} className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-bold text-[var(--app-text)]">{e.label}</div>
                      <div className="mt-1 text-xs text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">
                        {formatDateFr(e.date)} • {e.category}
                        {e.supplier ? ` • ${e.supplier}` : ""}
                      </div>
                      <div className="mt-2">
                        <Badge tone={e.status === "VALIDATED" ? "success" : "warning"}>{e.status}</Badge>
                      </div>
                    </div>
                    <div className="shrink-0 text-sm font-bold text-[var(--app-text)]">
                      {formatFcfa(parseDecimalToNumber(e.amount))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rapports récents</CardTitle>
            <CardDescription>{project._count.dailyReports} rapport(s) journalier(s)</CardDescription>
          </CardHeader>
          <div className="grid gap-2">
            {recentReports.length === 0 ? (
              <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
                Aucun rapport pour le moment.
              </div>
            ) : (
              recentReports.map((r) => (
                <div key={r.id} className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[var(--app-text)]">{formatDateFr(r.date)}</div>
                      <div className="mt-1 text-xs text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">
                        {r.weather ?? "—"} • Ouvriers: {r.workersCount ?? "—"} • Avancement: {r.progressEst ?? "—"}%
                      </div>
                      <div className="mt-2 text-sm text-[var(--app-text-muted)]">{r.workDone}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Devis récents</CardTitle>
            <CardDescription>{project._count.quotes} devis</CardDescription>
          </CardHeader>
          <div className="grid gap-2">
            {recentQuotes.length === 0 ? (
              <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">Aucun devis.</div>
            ) : (
              recentQuotes.map((q) => (
                <div key={q.id} className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-bold text-[var(--app-text)]">{q.title}</div>
                      <div className="mt-1 text-xs text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">
                        {q.clientName ?? project.clientName ?? "—"} • {formatDateFr(q.createdAt)}
                      </div>
                      <div className="mt-2">
                        <Badge tone={q.status === "ACCEPTED" ? "success" : q.status === "REJECTED" ? "danger" : "neutral"}>
                          {q.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="shrink-0 text-sm font-bold text-[var(--app-text)]">
                      {formatFcfa(parseDecimalToNumber(q.total))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Note technique</CardTitle>
          <CardDescription>
            Les données chantier, calculs et coûts sont estimatifs et doivent être validés par un professionnel selon les
            plans, les normes applicables et les conditions réelles du chantier.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
