import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type PlanBadgeVariant = "free" | "premium" | "soon" | "enterprise";

type PlanBadgeProps = {
  variant: PlanBadgeVariant;
  className?: string;
  children?: ReactNode;
};

export function PlanBadge({ variant, className, children }: PlanBadgeProps) {
  const styles: Record<PlanBadgeVariant, string> = {
    free: "bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] text-[var(--app-text-muted)] ring-1 ring-[var(--app-card-border)]",
    premium: "bg-[var(--cp-accent)] text-[var(--app-on-primary)] ring-1 ring-[color-mix(in_oklab,var(--cp-accent),black_18%)]",
    soon: "bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] text-[var(--app-text-muted)] ring-1 ring-[var(--app-card-border)]",
    enterprise:
      "bg-[color-mix(in_oklab,var(--cp-accent),black_35%)] text-[var(--app-on-primary)] ring-1 ring-[color-mix(in_oklab,var(--cp-accent),black_22%)]",
  };

  const labels: Record<PlanBadgeVariant, string> = {
    free: "Gratuit",
    premium: "Pro",
    soon: "Bientôt",
    enterprise: "Entreprise",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold",
        styles[variant],
        className,
      )}
    >
      {children ?? labels[variant]}
    </span>
  );
}
