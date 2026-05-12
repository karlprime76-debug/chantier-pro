import * as React from "react";

import { cn } from "@/lib/cn";

type CardProps = {
  className?: string;
  children: React.ReactNode;
};

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-[var(--app-card-border)] bg-[var(--app-card)] p-5 shadow-[var(--cp-shadow)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: CardProps) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function CardTitle({ className, children }: CardProps) {
  return <h2 className={cn("text-lg font-bold text-[var(--app-text)]", className)}>{children}</h2>;
}

export function CardDescription({ className, children }: CardProps) {
  return <p className={cn("mt-1 text-sm text-[var(--app-text-muted)]", className)}>{children}</p>;
}
