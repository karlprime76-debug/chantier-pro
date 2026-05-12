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
          date: true,
          status: true,
          project: { select: { id: true, name: true } },
        },
      })
    : [];

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--app-text)]">Dépenses</h1>
        <p className="mt-1 text-sm text-[var(--app-text-muted)]">Suis les achats, fournisseurs et validations.</p>
      </div>

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
                className="rounded-xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-4"
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
                <div className="mt-2 text-xs text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Statut: {e.status}</div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
