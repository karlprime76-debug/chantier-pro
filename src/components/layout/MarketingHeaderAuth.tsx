"use client";

import { useSession, signOut } from "next-auth/react";

import { Button } from "@/components/ui/Button";

export function MarketingHeaderAuth() {
  const { status } = useSession();

  if (status === "authenticated") {
    return (
      <div className="flex items-center gap-2">
        <Button href="/dashboard" variant="secondary" size="sm">
          Ouvrir mon tableau de bord
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            void signOut({ callbackUrl: "/" });
          }}
        >
          Se déconnecter
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button href="/login" variant="secondary" size="sm">
        Connexion
      </Button>
      <Button href="/register" size="sm">
        Créer un compte gratuit
      </Button>
    </div>
  );
}
