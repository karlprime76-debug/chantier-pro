"use client";

import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/Button";

export function MarketingHeaderNavDashboard() {
  const { status } = useSession();

  if (status !== "authenticated") return null;

  return (
    <Button href="/dashboard" variant="ghost" size="sm">
      Dashboard
    </Button>
  );
}
