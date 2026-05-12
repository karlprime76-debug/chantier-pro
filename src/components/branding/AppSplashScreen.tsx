"use client";

import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/cn";

type AppSplashScreenProps = {
  durationMs?: number;
};

export function AppSplashScreen({ durationMs = 1200 }: AppSplashScreenProps) {
  const [show, setShow] = React.useState(() => {
    if (typeof window === "undefined") return false;
    const key = "cp_splash_shown_v1";
    const already = window.sessionStorage.getItem(key);
    if (already) return false;
    window.sessionStorage.setItem(key, "1");
    return true;
  });

  React.useEffect(() => {
    if (!show) return;
    const t1 = window.setTimeout(() => setShow(false), durationMs);
    return () => {
      window.clearTimeout(t1);
    };
  }, [durationMs, show]);

  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[70] grid place-items-center",
        "bg-[var(--app-bg)]",
      )}
      aria-label="Chargement Chantier Pro"
      role="status"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.26),transparent_62%)] blur-3xl" />
        <div className="absolute bottom-[-260px] right-[-180px] h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(11,42,82,0.38),transparent_60%)] blur-3xl" />
      </div>

      <div
        className={cn(
          "relative grid justify-items-center gap-3",
          "cp-splash-in",
        )}
      >
        <div className="relative grid h-24 w-24 place-items-center">
          <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle,rgba(249,115,22,0.35),transparent_60%)] blur-xl" />
          <div className="relative grid h-20 w-20 place-items-center overflow-hidden rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_6%)] shadow-lg">
            <Image src="/logo.png" alt="Chantier Pro" width={80} height={80} className="h-14 w-14 object-contain" priority />
          </div>
        </div>

        <div className="text-center">
          <div className="text-lg font-extrabold tracking-tight text-[var(--app-text)]">Chantier Pro</div>
          <div className="mt-1 text-xs font-semibold text-[color-mix(in_oklab,var(--app-text),transparent_55%)]">Calculs · Chantiers · Documents</div>
        </div>
      </div>
    </div>
  );
}
