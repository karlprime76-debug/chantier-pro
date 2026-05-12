import { cn } from "@/lib/cn";

type PlanBadgeVariant = "free" | "premium" | "soon";

type PlanBadgeProps = {
  variant: PlanBadgeVariant;
  className?: string;
};

export function PlanBadge({ variant, className }: PlanBadgeProps) {
  const styles: Record<PlanBadgeVariant, string> = {
    free: "bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] text-[var(--app-text-muted)] ring-1 ring-[var(--app-card-border)]",
    premium: "bg-[var(--cp-accent)] text-[var(--app-on-primary)] ring-1 ring-[color-mix(in_oklab,var(--cp-accent),black_18%)]",
    soon: "bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] text-[var(--app-text-muted)] ring-1 ring-[var(--app-card-border)]",
  };

  const labels: Record<PlanBadgeVariant, string> = {
    free: "Gratuit",
    premium: "Premium",
    soon: "Bientôt",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold",
        styles[variant],
        className,
      )}
    >
      {labels[variant]}
    </span>
  );
}
