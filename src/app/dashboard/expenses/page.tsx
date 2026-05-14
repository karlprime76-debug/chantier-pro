import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { NewExpenseForm } from "@/components/expenses/NewExpenseForm";
import { prisma } from "@/lib/db/prisma";
import { requireSession } from "@/lib/auth/guards";

export default async function ExpensesPage() {
  const session = await requireSession();
  const user = session
    ? await prisma.user.findUnique({ where: { id: session.id }, select: { companyId: true } })
    : null;

  const expenses: Array<{
    id: string;
    category: string;
    label: string;
    amount: unknown;
    supplier: string | null;
    date: Date;
    status: string;
    project: { id: string; name: string };
  }> = user?.companyId
    ? await prisma.expense.findMany({
        where: { project: { companyId: user.companyId } },
        orderBy: { date: "desc" },
        take: 50,
        select: {
          id: true,
          category: true,
          label: true,
          amount: true,
          supplier: true,
          date: true,
          status: true,
          project: { select: { id: true, name: true } },
        },
      })
    : [];

  const totalAmount = expenses.reduce((acc, e) => acc + Number(e.amount ?? 0), 0);
  const validatedCount = expenses.filter((e) => e.status === "VALIDATED").length;

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--app-text)]">Dépenses</h1>
        <p className="mt-1 text-sm text-[var(--app-text-muted)]">Suis les achats, fournisseurs et validations.</p>
      </div>

      <Card className="cp-hover-lift">
        <CardHeader className="mb-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base">Résumé</CardTitle>
              <CardDescription className="mt-1">Vue rapide des dépenses récentes.</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold uppercase tracking-wide text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">
                Total
              </div>
              <div className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--app-text)]">
                {Number.isFinite(totalAmount) ? `${totalAmount.toLocaleString("fr-FR")}` : "0"}
              </div>
              <div className="text-xs text-[var(--app-text-muted)]">FCFA</div>
            </div>
          </div>
        </CardHeader>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
            <div className="text-xs font-bold uppercase tracking-wide text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">
              Dépenses
            </div>
            <div className="mt-2 text-2xl font-extrabold text-[var(--app-text)]">{expenses.length}</div>
            <div className="mt-1 text-sm text-[var(--app-text-muted)]">lignes enregistrées</div>
          </div>
          <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
            <div className="text-xs font-bold uppercase tracking-wide text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">
              Validées
            </div>
            <div className="mt-2 text-2xl font-extrabold text-[var(--app-text)]">{validatedCount}</div>
            <div className="mt-1 text-sm text-[var(--app-text-muted)]">statut OK</div>
          </div>
          <div className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4">
            <div className="text-xs font-bold uppercase tracking-wide text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">
              À valider
            </div>
            <div className="mt-2 text-2xl font-extrabold text-[var(--app-text)]">{Math.max(0, expenses.length - validatedCount)}</div>
            <div className="mt-1 text-sm text-[var(--app-text-muted)]">en attente</div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nouvelle dépense</CardTitle>
          <CardDescription>Lie une dépense à un chantier.</CardDescription>
        </CardHeader>

        <NewExpenseForm />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique</CardTitle>
          <CardDescription>{expenses.length} ligne(s) récentes</CardDescription>
        </CardHeader>
        <div className="grid gap-2">
          {expenses.length === 0 ? (
            <div className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4 text-sm text-[var(--app-text-muted)]">
              Aucune dépense.
            </div>
          ) : (
            expenses.map((e) => (
              <div
                key={e.id}
                className="rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-[var(--app-text)]">{e.label}</div>
                    <div className="mt-1 text-xs text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">
                      {e.category} • {e.project.name} • {new Date(e.date).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                  <div className="shrink-0 text-sm font-bold text-[var(--app-text)]">
                    {String(e.amount)} FCFA
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span
                    className={
                      e.status === "VALIDATED"
                        ? "inline-flex items-center rounded-full bg-[color-mix(in_oklab,#16a34a,white_86%)] px-2.5 py-1 text-[11px] font-extrabold text-[#166534] ring-1 ring-[color-mix(in_oklab,#16a34a,black_72%)]"
                        : "inline-flex items-center rounded-full bg-[color-mix(in_oklab,var(--app-primary),transparent_86%)] px-2.5 py-1 text-[11px] font-extrabold text-[var(--app-primary)] ring-1 ring-[var(--app-card-border)]"
                    }
                  >
                    {e.status === "VALIDATED" ? "Validée" : "En attente"}
                  </span>
                  <span className="text-xs text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">{e.supplier ? `Fournisseur: ${e.supplier}` : ""}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
