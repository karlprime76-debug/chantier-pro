"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { cn } from "@/lib/cn";

type PressableCardProps = {
  className?: string;
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  loadingText?: string;
  disabled?: boolean;
};

export function PressableCard({
  className,
  children,
  href,
  onClick,
  loadingText = "Ouverture…",
  disabled,
}: PressableCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const canPress = !disabled && !isPending;

  return (
    <div
      role={href ? "link" : "button"}
      aria-disabled={!canPress}
      aria-busy={isPending}
      tabIndex={canPress ? 0 : -1}
      className={cn(
        "rounded-3xl border border-[var(--cp-border)] bg-[var(--cp-card)] p-5 shadow-[var(--cp-shadow)]",
        "select-none touch-manipulation transition duration-150 will-change-transform",
        canPress && "cursor-pointer active:scale-[0.98] active:opacity-90",
        (!canPress || disabled) && "opacity-60",
        className,
      )}
      onClick={() => {
        if (!canPress) return;
        if (href) {
          startTransition(() => {
            router.push(href);
          });
          return;
        }
        onClick?.();
      }}
      onKeyDown={(e) => {
        if (!canPress) return;
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        if (href) {
          startTransition(() => {
            router.push(href);
          });
          return;
        }
        onClick?.();
      }}
    >
      {children}
      {isPending ? <div className="mt-3 text-xs font-semibold text-white/55">{loadingText}</div> : null}
    </div>
  );
}
