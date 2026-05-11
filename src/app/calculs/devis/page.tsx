import { redirect } from "next/navigation";

import DevisClient from "@/app/calculs/devis/client";
import { requireSession } from "@/lib/auth/guards";
import { canAccessFeature } from "@/lib/subscription/access";
import { getEffectiveUserPlan } from "@/lib/subscription/server";

export default async function DevisPage() {
  const session = await requireSession();
  if (!session) redirect("/login?next=/calculs/devis");

  const plan = await getEffectiveUserPlan(session);
  if (!canAccessFeature(plan, "quote_pdf")) redirect("/pricing");

  return <DevisClient />;
}
