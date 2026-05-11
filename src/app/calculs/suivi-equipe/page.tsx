import { redirect } from "next/navigation";

import SuiviEquipeClient from "@/app/calculs/suivi-equipe/client";
import { requireSession } from "@/lib/auth/guards";
import { canAccessFeature } from "@/lib/subscription/access";
import { getEffectiveUserPlan } from "@/lib/subscription/server";

export default async function SuiviEquipePage() {
  const session = await requireSession();
  if (!session) redirect("/login?next=/calculs/suivi-equipe");

  const plan = await getEffectiveUserPlan(session);
  if (!canAccessFeature(plan, "team_management")) redirect("/pricing");

  return <SuiviEquipeClient />;
}
