import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/AppShell";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { requireSession } from "@/lib/auth/guards";

const items = [
  {
    title: "Dashboard",
    description: "Aperçu global de ton activité.",
    href: "/dashboard",
  },
  {
    title: "Dépenses",
    description: "Suivi des dépenses par chantier.",
    href: "/dashboard/expenses",
  },
  {
    title: "Rapports",
    description: "Rapports journaliers.",
    href: "/dashboard/reports",
  },
  {
    title: "Réglages",
    description: "Compte, préférences, entreprise.",
    href: "/dashboard/settings",
  },
  {
    title: "Profil",
    description: "Informations utilisateur (à compléter).",
    href: "/dashboard/settings",
  },
  {
    title: "Premium / Abonnement",
    description: "Voir les offres et ton statut.",
    href: "/pricing",
  },
];

export default async function MorePage() {
  const session = await requireSession();
  if (!session) redirect("/login?next=/more");

  return (
    <div className="min-h-full">
      <AppShell className="pb-[calc(104px+env(safe-area-inset-bottom))] sm:pb-10">
        <div className="grid gap-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--app-text)]">Plus</h1>
            <p className="mt-1 text-sm text-[var(--app-text-muted)]">Accès rapide aux sections secondaires.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <Card key={item.href}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <div className="px-6 pb-6">
                  <Button href={item.href} variant="secondary" size="sm">
                    Ouvrir
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </AppShell>
      <MobileBottomNav />
    </div>
  );
}
