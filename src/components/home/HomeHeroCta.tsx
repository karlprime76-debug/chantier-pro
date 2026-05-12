"use client";

import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/Button";

export function HomeHeroCta() {
  const { status } = useSession();

  if (status === "authenticated") {
    return (
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button href="/dashboard/projects" variant="secondary" size="lg">
          Accéder à mes chantiers
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <Button href="/login" variant="secondary" size="lg">
        Connexion
      </Button>
      <Button href="/register" size="lg">
        Créer un compte gratuit
      </Button>
    </div>
  );
}
