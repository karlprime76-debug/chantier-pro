"use client";

import { useSession, signOut } from "next-auth/react";

import { Button } from "@/components/ui/Button";

type MarketingHeaderAuthProps = {
  compact?: boolean;
  variant?: "header" | "mobile_menu";
  onAction?: () => void;
};

export function MarketingHeaderAuth({ compact, variant = "header", onAction }: MarketingHeaderAuthProps) {
  const { status } = useSession();

  if (variant === "mobile_menu") {
    if (status !== "authenticated") return null;

    return (
      <div className="grid gap-2">
        <Button
          href="/dashboard"
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => {
            onAction?.();
          }}
        >
          Tableau de bord
        </Button>
        <Button
          href="/dashboard/settings"
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => {
            onAction?.();
          }}
        >
          Mon compte
        </Button>

        <div className="pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full justify-start text-[var(--cp-accent)]"
            onClick={() => {
              onAction?.();
              void signOut({ callbackUrl: "/" });
            }}
          >
            Se déconnecter
          </Button>
        </div>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="flex items-center gap-2">
        <Button href="/dashboard" variant={compact ? undefined : "secondary"} size="sm" className="whitespace-nowrap">
          Tableau de bord
        </Button>
        {!compact && (
          <Button href="/dashboard/settings" variant="ghost" size="sm" className="whitespace-nowrap">
            Mon compte
          </Button>
        )}
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
      <Button href="/login" variant={compact ? "ghost" : "secondary"} size="sm" className="whitespace-nowrap">
        Connexion
      </Button>
      <Button href="/register" size="sm" className="whitespace-nowrap">
        Créer un compte
      </Button>
    </div>
  );
}
