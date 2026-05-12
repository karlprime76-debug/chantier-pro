"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type HomeProtectedCardLinkProps = {
  hrefAuthenticated: string;
  hrefUnauthenticated?: string;
  ariaLabelAuthenticated: string;
  ariaLabelUnauthenticated: string;
  className: string;
  children: ReactNode;
};

export function HomeProtectedCardLink({
  hrefAuthenticated,
  hrefUnauthenticated = "/register",
  ariaLabelAuthenticated,
  ariaLabelUnauthenticated,
  className,
  children,
}: HomeProtectedCardLinkProps) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const href = isAuthenticated ? hrefAuthenticated : hrefUnauthenticated;
  const ariaLabel = isAuthenticated ? ariaLabelAuthenticated : ariaLabelUnauthenticated;

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cn(className)}
    >
      {children}
    </Link>
  );
}
