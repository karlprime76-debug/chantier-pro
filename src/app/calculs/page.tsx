import { redirect } from "next/navigation";

import { requireSession } from "@/lib/auth/guards";

export default async function CalculsPage() {
  const session = await requireSession();
  if (!session) redirect("/login?next=/calculs");

  redirect("/dashboard/calculators");
}
