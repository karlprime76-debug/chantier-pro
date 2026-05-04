import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

type PremiumLockProps = {
  title?: string;
  description?: string;
};

export function PremiumLock({
  title = "Fonctionnalité Pro",
  description = "Débloquez ce calculateur pour gagner du temps sur vos estimations chantier.",
}: PremiumLockProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
        <div className="text-sm font-semibold text-white">Accès restreint</div>
        <div className="mt-1 text-sm text-white/60">
          Passez au plan Pro pour activer cette fonctionnalité.
        </div>
      </div>
    </Card>
  );
}
