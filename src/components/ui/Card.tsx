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
        "rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.2)]",
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
  return <h2 className={cn("text-lg font-bold text-white", className)}>{children}</h2>;
}

export function CardDescription({ className, children }: CardProps) {
  return <p className={cn("mt-1 text-sm text-white/60", className)}>{children}</p>;
}
