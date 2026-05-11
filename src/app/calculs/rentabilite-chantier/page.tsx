import { redirect } from "next/navigation";

import RentabiliteChantierClient from "@/app/calculs/rentabilite-chantier/client";
import { requireSession } from "@/lib/auth/guards";
import { canAccessFeature } from "@/lib/subscription/access";
import { getEffectiveUserPlan } from "@/lib/subscription/server";

export default async function RentabiliteChantierPage() {
  const session = await requireSession();
  if (!session) redirect("/login?next=/calculs/rentabilite-chantier");

  const plan = await getEffectiveUserPlan(session);
  if (!canAccessFeature(plan, "project_profitability")) redirect("/pricing");

  return <RentabiliteChantierClient />;
}
