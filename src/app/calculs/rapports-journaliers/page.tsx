import { redirect } from "next/navigation";

import RapportsJournaliersClient from "@/app/calculs/rapports-journaliers/client";
import { requireSession } from "@/lib/auth/guards";
import { canAccessFeature } from "@/lib/subscription/access";
import { getEffectiveUserPlan } from "@/lib/subscription/server";

export default async function RapportsJournaliersPage() {
  const session = await requireSession();
  if (!session) redirect("/login?next=/calculs/rapports-journaliers");

  const plan = await getEffectiveUserPlan(session);
  if (!canAccessFeature(plan, "daily_reports")) redirect("/pricing");

  return <RapportsJournaliersClient />;
}
