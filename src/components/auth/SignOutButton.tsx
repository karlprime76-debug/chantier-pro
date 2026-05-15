"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/Button";

type SignOutButtonProps = {
  className?: string;
};

export function SignOutButton({ className }: SignOutButtonProps) {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      type="button"
      variant="secondary"
      size="lg"
      className={className}
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          await signOut({ callbackUrl: "/" });
        } finally {
          setLoading(false);
        }
      }}
    >
      Se déconnecter
    </Button>
  );
}
