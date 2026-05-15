import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/AppShell";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { requireSession } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: "Dashboard | Chantier Pro",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutInner>{children}</DashboardLayoutInner>;
}

async function DashboardLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  if (!session) redirect("/login?next=/dashboard");

  return (
    <div className="min-h-full">
      <DashboardSidebar />
      <div className="sm:pl-64">
        <AppShell className="pb-[calc(104px+env(safe-area-inset-bottom))] sm:pb-10">
          <div className="min-w-0">{children}</div>
        </AppShell>
      </div>
      <MobileBottomNav />
    </div>
  );
}
