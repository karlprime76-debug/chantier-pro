import { redirect } from "next/navigation";

import ChecklistsChantierClient from "@/app/calculs/checklists-chantier/client";
import { requireSession } from "@/lib/auth/guards";
import { canAccessFeature } from "@/lib/subscription/access";
import { getEffectiveUserPlan } from "@/lib/subscription/server";

export default async function ChecklistsChantierPage() {
  const session = await requireSession();
  if (!session) redirect("/login?next=/calculs/checklists-chantier");

  const plan = await getEffectiveUserPlan(session);
  if (!canAccessFeature(plan, "site_checklists")) redirect("/pricing");

  return <ChecklistsChantierClient />;
}
