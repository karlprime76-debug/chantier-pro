import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonSize = "sm" | "md" | "lg";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
};

function styles({
  variant,
  size,
}: {
  variant: ButtonVariant;
  size: ButtonSize;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold select-none touch-manipulation transition duration-150 will-change-transform active:scale-[0.98] active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)] disabled:opacity-60 disabled:pointer-events-none";

  const sizes: Record<ButtonSize, string> = {
    sm: "min-h-9 px-3 py-2 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-5 text-base",
  };

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-[var(--app-primary)] text-[var(--app-on-primary)] hover:bg-[color-mix(in_oklab,var(--app-primary),black_14%)] focus-visible:ring-[var(--app-primary)]",
    secondary:
      "bg-[var(--app-primary-soft)] text-[var(--app-primary)] ring-1 ring-[var(--app-card-border)] hover:bg-[color-mix(in_oklab,var(--app-primary-soft),black_4%)] focus-visible:ring-[var(--app-primary)]",
    ghost:
      "bg-transparent text-[color-mix(in_oklab,var(--app-text),transparent_15%)] hover:bg-[color-mix(in_oklab,var(--app-text),transparent_92%)] ring-1 ring-transparent hover:ring-[var(--app-card-border)] focus-visible:ring-[var(--app-primary)]",
  };

  return cn(base, sizes[size], variants[variant]);
}

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: never;
  };

type LinkButtonProps = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
  };

export function Button(props: ButtonProps | LinkButtonProps) {
  if ("href" in props && typeof props.href === "string") {
    const {
      variant = "primary",
      size = "md",
      className,
      children,
      href,
      ...anchorProps
    } = props;

    const cls = cn(styles({ variant, size }), className);

    return (
      <Link href={href} className={cls} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const {
    variant = "primary",
    size = "md",
    className,
    children,
    ...buttonProps
  } = props;

  const cls = cn(styles({ variant, size }), className);

  return (
    <button className={cls} {...buttonProps}>
      {children}
    </button>
  );
}
