import { redirect } from "next/navigation";

import RapportsChantierPdfClient from "@/app/calculs/rapports-chantier-pdf/client";
import { requireSession } from "@/lib/auth/guards";
import { canAccessFeature } from "@/lib/subscription/access";
import { getEffectiveUserPlan } from "@/lib/subscription/server";

export default async function RapportsChantierPdfPage() {
  const session = await requireSession();
  if (!session) redirect("/login?next=/calculs/rapports-chantier-pdf");

  const plan = await getEffectiveUserPlan(session);
  if (!canAccessFeature(plan, "report_pdf")) redirect("/pricing");

  return <RapportsChantierPdfClient />;
}
