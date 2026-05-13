"use client";

import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/Button";

type HomePublicCtasProps = {
  variant?: "hero" | "quickstart" | "pair";
};

export function HomePublicCtas({ variant = "hero" }: HomePublicCtasProps) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  if (variant === "pair") {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button href={isAuthenticated ? "/dashboard/projects" : "/register"} size="lg" variant="secondary" className="whitespace-nowrap">
          {isAuthenticated ? "Accéder à mes chantiers" : "Créer un compte gratuit"}
        </Button>
        <Button href="/pricing" size="lg" variant="ghost" className="whitespace-nowrap">
          Voir les tarifs
        </Button>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div
        className={
          variant === "hero"
            ? "mt-6 w-full max-w-sm mx-auto flex flex-col items-stretch gap-3 text-center sm:max-w-none sm:mx-0 sm:flex-row sm:flex-wrap sm:items-center sm:text-left"
            : "grid gap-3"
        }
      >
        <Button
          href="/dashboard/projects"
          size={variant === "hero" ? "lg" : undefined}
          variant="secondary"
          className={
            variant === "hero" ? "w-full justify-center whitespace-nowrap sm:w-auto sm:min-w-fit" : undefined
          }
        >
          Accéder à mes chantiers
        </Button>
        <Button
          href="/dashboard"
          size={variant === "hero" ? "lg" : undefined}
          variant="ghost"
          className={
            variant === "hero"
              ? "w-full justify-center whitespace-nowrap bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] text-[var(--app-text)] ring-1 ring-[var(--app-card-border)] sm:w-auto sm:min-w-fit sm:bg-transparent sm:text-[color-mix(in_oklab,var(--app-text),transparent_15%)] sm:ring-transparent"
              : undefined
          }
        >
          Ouvrir mon tableau de bord
        </Button>
        <Button
          href="/features"
          size={variant === "hero" ? "lg" : undefined}
          variant="ghost"
          className={
            variant === "hero"
              ? "w-full justify-center whitespace-nowrap bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] text-[var(--app-text)] ring-1 ring-[var(--app-card-border)] sm:w-auto sm:min-w-fit sm:bg-transparent sm:text-[color-mix(in_oklab,var(--app-text),transparent_15%)] sm:ring-transparent"
              : undefined
          }
        >
          Découvrir les fonctionnalités
        </Button>
      </div>
    );
  }

  return (
    <div className={variant === "hero" ? "mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap" : "grid gap-3"}>
      <Button
        href="/login"
        size={variant === "hero" ? "lg" : undefined}
        variant={variant === "hero" ? "secondary" : "ghost"}
        className={variant === "hero" ? "whitespace-nowrap" : undefined}
      >
        Connexion
      </Button>
      <Button href="/register" size={variant === "hero" ? "lg" : undefined} className={variant === "hero" ? "whitespace-nowrap" : undefined}>
        Créer un compte gratuit
      </Button>
      <Button
        href={variant === "hero" ? "/pricing" : "/features"}
        size={variant === "hero" ? "lg" : undefined}
        variant="ghost"
        className={variant === "hero" ? "whitespace-nowrap" : undefined}
      >
        {variant === "hero" ? "Voir les tarifs" : "Découvrir les fonctionnalités"}
      </Button>
    </div>
  );
}
