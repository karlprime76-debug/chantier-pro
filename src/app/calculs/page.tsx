import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/AppShell";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { CalculatorsHub } from "@/components/calculators/CalculatorsHub";
import { requireSession } from "@/lib/auth/guards";
import { getEffectiveUserPlan } from "@/lib/subscription/server";

export default async function CalculsPage() {
  const session = await requireSession();
  if (!session) redirect("/login?next=/calculs");

  const userPlan = await getEffectiveUserPlan(session);

  return (
    <div className="min-h-full">
      <AppShell className="pb-[calc(104px+env(safe-area-inset-bottom))] sm:pb-10">
        <CalculatorsHub userPlan={userPlan} />
      </AppShell>
      <MobileBottomNav />
    </div>
  );
}
