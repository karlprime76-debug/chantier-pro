import { redirect } from "next/navigation";

import BudgetChantierClient from "@/app/calculs/budget-chantier/client";
import { requireSession } from "@/lib/auth/guards";
import { canAccessFeature } from "@/lib/subscription/access";
import { getEffectiveUserPlan } from "@/lib/subscription/server";

export default async function BudgetChantierPage() {
  const session = await requireSession();
  if (!session) redirect("/login?next=/calculs/budget-chantier");

  const plan = await getEffectiveUserPlan(session);
  if (!canAccessFeature(plan, "project_budget")) redirect("/pricing");

  return <BudgetChantierClient />;
}
