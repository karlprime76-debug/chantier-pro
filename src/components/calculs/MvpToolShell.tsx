import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

type MvpToolShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function MvpToolShell({ title, subtitle, children }: MvpToolShellProps) {
  return (
    <div className="min-h-full">
      <AppShell className="pb-[calc(104px+env(safe-area-inset-bottom))] sm:pb-10">
        <div className="grid gap-6">
          <div className="pt-[env(safe-area-inset-top)]">
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--cp-text)]">{title}</h1>
            {subtitle ? (
              <p className="mt-1 text-sm text-[color-mix(in_oklab,var(--cp-text),transparent_45%)]">{subtitle}</p>
            ) : null}
          </div>
          {children}
        </div>
      </AppShell>
      <MobileBottomNav />
    </div>
  );
}
