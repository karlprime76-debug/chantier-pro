"use client";

import dynamic from "next/dynamic";

const InstallAppCard = dynamic(
  () => import("@/components/pwa/InstallAppCard").then((m) => m.InstallAppCard),
  { ssr: false },
);

const PlanTabs = dynamic(() => import("@/components/subscription/PlanTabs").then((m) => m.PlanTabs), { ssr: false });

export function HomeClientExtras() {
  return (
    <>
      <div className="mt-6">
        <InstallAppCard />
      </div>

      <div className="mt-8 rounded-2xl border border-[var(--app-card-border)] bg-[color-mix(in_oklab,var(--app-card),transparent_10%)] p-5">
        <PlanTabs defaultTab="free" />
      </div>
    </>
  );
}
