import { redirect } from "next/navigation";

import PriceLibraryClient from "@/app/calculs/bibliotheque-prix/client";
import { requireSession } from "@/lib/auth/guards";
import { getEffectiveUserPlan } from "@/lib/subscription/server";
import { canAccessFeature } from "@/lib/subscription/access";

export default async function PriceLibraryPage() {
  const session = await requireSession();
  if (!session) redirect("/login?next=/calculs/bibliotheque-prix");

  const plan = await getEffectiveUserPlan(session);
  if (!canAccessFeature(plan, "price_library")) redirect("/pricing");

  return <PriceLibraryClient />;
}
