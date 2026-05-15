import { redirect } from "next/navigation";

import { CalculatorsHub } from "@/components/calculators/CalculatorsHub";
import { requireSession } from "@/lib/auth/guards";
import { getEffectiveUserPlan } from "@/lib/subscription/server";

export default async function DashboardCalculatorsPage() {
  const session = await requireSession();
  if (!session) redirect("/login?next=/dashboard/calculators");

  const userPlan = await getEffectiveUserPlan(session);

  return <CalculatorsHub userPlan={userPlan} />;
}
