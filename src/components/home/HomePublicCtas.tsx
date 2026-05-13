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
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button href={isAuthenticated ? "/dashboard/projects" : "/register"} size="lg" variant="secondary">
          {isAuthenticated ? "Accéder à mes chantiers" : "Créer un compte gratuit"}
        </Button>
        <Button href="/pricing" size="lg" variant="ghost">
          Voir les tarifs
        </Button>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className={variant === "hero" ? "mt-6 flex flex-col gap-3 sm:flex-row" : "grid gap-3"}>
        <Button href="/dashboard/projects" size={variant === "hero" ? "lg" : undefined} variant="secondary">
          Accéder à mes chantiers
        </Button>
        <Button href="/dashboard" size={variant === "hero" ? "lg" : undefined} variant="ghost">
          Ouvrir mon tableau de bord
        </Button>
        <Button href="#fonctionnalites" size={variant === "hero" ? "lg" : undefined} variant="ghost">
          Découvrir les fonctionnalités
        </Button>
      </div>
    );
  }

  return (
    <div className={variant === "hero" ? "mt-6 flex flex-col gap-3 sm:flex-row" : "grid gap-3"}>
      <Button href="/login" size={variant === "hero" ? "lg" : undefined} variant={variant === "hero" ? "secondary" : "ghost"}>
        Connexion
      </Button>
      <Button href="/register" size={variant === "hero" ? "lg" : undefined}>
        Créer un compte gratuit
      </Button>
      <Button href={variant === "hero" ? "/pricing" : "#fonctionnalites"} size={variant === "hero" ? "lg" : undefined} variant="ghost">
        {variant === "hero" ? "Voir les tarifs" : "Découvrir les fonctionnalités"}
      </Button>
    </div>
  );
}
