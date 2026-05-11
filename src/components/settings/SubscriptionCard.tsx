import { ResponsiveButton } from "@/components/ui/ResponsiveButton";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import type { UserPlan } from "@/lib/subscription/access";

type SubscriptionCardProps = {
  plan: UserPlan;
};

function planLabel(plan: UserPlan) {
  if (plan === "ENTERPRISE") return "Entreprise";
  if (plan === "PREMIUM") return "Premium";
  return "Gratuit";
}

export function SubscriptionCard({ plan }: SubscriptionCardProps) {
  const label = planLabel(plan);
  const status = plan === "FREE" ? "Aucun abonnement actif" : "Actif";

  const action =
    plan === "FREE"
      ? { href: "/pricing", label: "Voir les tarifs" }
      : plan === "ENTERPRISE"
        ? { href: "/pricing", label: "Gérer l’offre Entreprise" }
        : { href: "/pricing", label: "Gérer mon abonnement" };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Abonnement</CardTitle>
        <CardDescription>Votre offre actuelle.</CardDescription>
      </CardHeader>

      <div className="grid gap-3 rounded-2xl border border-[var(--cp-border)] bg-[color-mix(in_oklab,var(--cp-card),transparent_8%)] p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-[color-mix(in_oklab,var(--cp-text),transparent_45%)]">Plan actuel</div>
            <div className="mt-1 text-lg font-extrabold text-[var(--cp-text)]">{label}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-[color-mix(in_oklab,var(--cp-text),transparent_45%)]">Statut</div>
            <div className="mt-1 text-sm font-bold text-[var(--cp-text)]">{status}</div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <ResponsiveButton href={action.href} prefetch loadingText="Ouverture…" size="lg">
            {action.label}
          </ResponsiveButton>
        </div>
      </div>
    </Card>
  );
}
