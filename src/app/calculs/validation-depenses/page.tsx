import { redirect } from "next/navigation";

import ValidationDepensesClient from "@/app/calculs/validation-depenses/client";
import { requireSession } from "@/lib/auth/guards";
import { canAccessFeature } from "@/lib/subscription/access";
import { getEffectiveUserPlan } from "@/lib/subscription/server";

export default async function ValidationDepensesPage() {
  const session = await requireSession();
  if (!session) redirect("/login?next=/calculs/validation-depenses");

  const plan = await getEffectiveUserPlan(session);
  if (!canAccessFeature(plan, "expenses_validation")) redirect("/pricing");

  return <ValidationDepensesClient />;
}
