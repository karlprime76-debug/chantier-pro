"use client";

import { useSession, signOut } from "next-auth/react";

import { Button } from "@/components/ui/Button";

export function MarketingHeaderAuth() {
  const { status } = useSession();

  if (status === "authenticated") {
    return (
      <div className="flex items-center gap-2">
        <Button href="/dashboard" variant="secondary" size="sm">
          <span className="sm:hidden">Dash</span>
          <span className="hidden sm:inline">Dashboard</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            void signOut({ callbackUrl: "/" });
          }}
        >
          <span className="sm:hidden">Sortir</span>
          <span className="hidden sm:inline">Se déconnecter</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button href="/login" variant="secondary" size="sm">
        <span className="sm:hidden">Login</span>
        <span className="hidden sm:inline">Connexion</span>
      </Button>
      <Button href="/register" size="sm">
        <span className="sm:hidden">Créer</span>
        <span className="hidden sm:inline">Créer un compte</span>
      </Button>
    </div>
  );
}
