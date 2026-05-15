import { redirect } from "next/navigation";

import { requireSession } from "@/lib/auth/guards";

export default async function MorePage() {
  const session = await requireSession();
  if (!session) redirect("/login?next=/more");

  redirect("/dashboard/settings");
}
