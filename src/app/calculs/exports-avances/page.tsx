import { redirect } from "next/navigation";

import ExportsAvancesClient from "@/app/calculs/exports-avances/client";
import { requireSession } from "@/lib/auth/guards";
import { canAccessFeature } from "@/lib/subscription/access";
import { getEffectiveUserPlan } from "@/lib/subscription/server";

export default async function ExportsAvancesPage() {
  const session = await requireSession();
  if (!session) redirect("/login?next=/calculs/exports-avances");

  const plan = await getEffectiveUserPlan(session);
  if (!canAccessFeature(plan, "advanced_exports")) redirect("/pricing");

  return <ExportsAvancesClient />;
}
