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
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cp-bg)] disabled:opacity-60 disabled:pointer-events-none";

  const sizes: Record<ButtonSize, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-5 text-base",
  };

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-[var(--cp-accent)] text-white hover:bg-[color-mix(in_oklab,var(--cp-accent),black_12%)] focus-visible:ring-[var(--cp-accent)]",
    secondary:
      "bg-white/5 text-white ring-1 ring-white/12 hover:bg-white/8 focus-visible:ring-white/40",
    ghost:
      "bg-transparent text-white/85 hover:bg-white/6 ring-1 ring-transparent hover:ring-white/10 focus-visible:ring-white/30",
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
