import Link from "next/link";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/AppShell";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { PlanBadge } from "@/components/ui/PlanBadge";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { requireSession } from "@/lib/auth/guards";

const calculators = [
  {
    title: "Béton",
    description: "Volume + marge de perte + estimation matériaux.",
    href: "/dashboard/calculators/concrete",
    badge: "free" as const,
  },
  {
    title: "Acier",
    description: "Calcul simple d’acier (MVP).",
    href: "/dashboard/calculators/steel",
    badge: "free" as const,
  },
  {
    title: "Escalier droit",
    description: "Confort, paillasse et volume béton.",
    href: "/dashboard/calculators/stairs/straight",
    badge: "premium" as const,
  },
  {
    title: "Coffrage",
    description: "Estimation coffrage (à affiner).",
    href: "/dashboard/calculators/formwork",
    badge: "premium" as const,
  },
  {
    title: "Maçonnerie",
    description: "Estimation simple (MVP).",
    href: "/dashboard/calculators/masonry",
    badge: "premium" as const,
  },
];

export default async function CalculsPage() {
  const session = await requireSession();
  if (!session) redirect("/login?next=/calculs");

  return (
    <div className="min-h-full">
      <AppShell className="pb-[calc(104px+env(safe-area-inset-bottom))] sm:pb-10">
        <div className="grid gap-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">Calculs</h1>
            <p className="mt-1 text-sm text-white/60">Tous les calculateurs disponibles, regroupés au même endroit.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {calculators.map((c) => (
              <Card key={c.href}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle>{c.title}</CardTitle>
                      <CardDescription>{c.description}</CardDescription>
                    </div>
                    <PlanBadge variant={c.badge} />
                  </div>
                </CardHeader>
                <div className="px-6 pb-6">
                  <Button href={c.href} variant="secondary" size="sm">
                    Ouvrir
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-sm text-white/60">
            Tu veux un calculateur supplémentaire ?
            {" "}
            <Link href="/more" className="font-semibold text-white hover:underline">
              Voir Plus
            </Link>
          </div>
        </div>
      </AppShell>
      <MobileBottomNav />
    </div>
  );
}
