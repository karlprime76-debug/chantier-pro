import { redirect } from "next/navigation";

import DosageLibraryClient from "@/app/calculs/bibliotheque-dosages/client";
import { requireSession } from "@/lib/auth/guards";
import { canAccessFeature } from "@/lib/subscription/access";
import { getEffectiveUserPlan } from "@/lib/subscription/server";

export default async function BibliothequeDosagesPage() {
  const session = await requireSession();
  if (!session) redirect("/login?next=/calculs/bibliotheque-dosages");

  const plan = await getEffectiveUserPlan(session);
  if (!canAccessFeature(plan, "dosage_library")) redirect("/pricing");

  return <DosageLibraryClient />;
}
