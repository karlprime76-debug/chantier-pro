import { redirect } from "next/navigation";

import RapportsControleClient from "@/app/calculs/rapports-controle/client";
import { requireSession } from "@/lib/auth/guards";
import { canAccessFeature } from "@/lib/subscription/access";
import { getEffectiveUserPlan } from "@/lib/subscription/server";

export default async function RapportsControlePage() {
  const session = await requireSession();
  if (!session) redirect("/login?next=/calculs/rapports-controle");

  const plan = await getEffectiveUserPlan(session);
  if (!canAccessFeature(plan, "control_reports")) redirect("/pricing");

  return <RapportsControleClient />;
}
