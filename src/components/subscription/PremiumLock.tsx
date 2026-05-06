import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { PlanBadge } from "@/components/ui/PlanBadge";

type PremiumLockProps = {
  title?: string;
  description?: string;
};

export function PremiumLock({
  title = "Fonctionnalité Premium",
  description = "Débloquez ce calculateur pour gagner du temps sur vos estimations chantier.",
}: PremiumLockProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{title}</CardTitle>
          <PlanBadge variant="premium" />
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
        <div className="text-sm font-semibold text-white">Accès restreint</div>
        <div className="mt-1 text-sm text-white/60">
          Passez au plan Premium pour activer cette fonctionnalité.
        </div>
        <div className="mt-3 text-xs text-white/55">
          Si tu penses avoir déjà accès, vérifie que tu es connecté avec le bon compte.
        </div>
      </div>
    </Card>
  );
}
