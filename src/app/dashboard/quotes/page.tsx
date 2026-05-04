import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { NewQuoteForm } from "@/components/quotes/NewQuoteForm";
import { prisma } from "@/lib/db/prisma";
import { requireSession } from "@/lib/auth/guards";

export default async function QuotesPage() {
  const session = await requireSession();
  const user = session
    ? await prisma.user.findUnique({ where: { id: session.id }, select: { companyId: true } })
    : null;

  const quotes: Array<{
    id: string;
    title: string;
    status: string;
    total: unknown;
    createdAt: Date;
    project: { id: string; name: string };
  }> = user?.companyId
    ? await prisma.quote.findMany({
        where: { project: { companyId: user.companyId } },
        orderBy: { createdAt: "desc" },
        take: 30,
        select: {
          id: true,
          title: true,
          status: true,
          total: true,
          createdAt: true,
          project: { select: { id: true, name: true } },
        },
      })
    : [];

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Devis</h1>
        <p className="mt-1 text-sm text-white/60">Devis simple (PDF plus tard).</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nouveau devis</CardTitle>
          <CardDescription>Ajoute des lignes, calcule total, puis envoie.</CardDescription>
        </CardHeader>

        <NewQuoteForm />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique</CardTitle>
          <CardDescription>{quotes.length} devis</CardDescription>
        </CardHeader>
        <div className="grid gap-2">
          {quotes.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
              Aucun devis.
            </div>
          ) : (
            quotes.map((q) => (
              <div key={q.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-white">{q.title}</div>
                    <div className="mt-1 text-xs text-white/55">
                      {q.project.name} • {q.status} • {new Date(q.createdAt).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                  <div className="shrink-0 text-sm font-bold text-white">{String(q.total)} FCFA</div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
