"use client";

import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/Button";

export function HomeHeroCta() {
  const { status } = useSession();

  if (status === "authenticated") {
    return (
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button href="/dashboard" variant="secondary" size="lg">
          Voir le dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <Button href="/register" size="lg">
        Créer un compte
      </Button>
      <Button href="/dashboard" variant="secondary" size="lg">
        Voir le dashboard
      </Button>
    </div>
  );
}
