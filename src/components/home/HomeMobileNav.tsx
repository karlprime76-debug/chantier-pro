"use client";

import { useSession } from "next-auth/react";

import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export function HomeMobileNav() {
  const { status } = useSession();

  if (status !== "authenticated") return null;

  return <MobileBottomNav />;
}
