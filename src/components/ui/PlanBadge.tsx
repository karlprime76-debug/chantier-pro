import { cn } from "@/lib/cn";

type PlanBadgeVariant = "free" | "premium" | "soon";

type PlanBadgeProps = {
  variant: PlanBadgeVariant;
  className?: string;
};

export function PlanBadge({ variant, className }: PlanBadgeProps) {
  const styles: Record<PlanBadgeVariant, string> = {
    free: "bg-white/5 text-white/75 ring-1 ring-white/10",
    premium: "bg-[var(--cp-accent)] text-white ring-1 ring-[color-mix(in_oklab,var(--cp-accent),black_18%)]",
    soon: "bg-white/5 text-white/70 ring-1 ring-white/10",
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
