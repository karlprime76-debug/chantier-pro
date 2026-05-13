"use client";

import { useSession, signOut } from "next-auth/react";

import { Button } from "@/components/ui/Button";

type MarketingHeaderAuthProps = {
  compact?: boolean;
};

export function MarketingHeaderAuth({ compact }: MarketingHeaderAuthProps) {
  const { status } = useSession();

  if (status === "authenticated") {
    return (
      <div className="flex items-center gap-2">
        <Button href="/dashboard" variant={compact ? undefined : "secondary"} size="sm" className="whitespace-nowrap">
          Ouvrir mon tableau de bord
        </Button>
        {!compact && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="whitespace-nowrap"
            onClick={() => {
              void signOut({ callbackUrl: "/" });
            }}
          >
            Se déconnecter
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {!compact && (
        <Button href="/login" variant="secondary" size="sm" className="whitespace-nowrap">
          Connexion
        </Button>
      )}
      <Button href="/register" size="sm" className="whitespace-nowrap">
        Créer un compte
      </Button>
    </div>
  );
}
