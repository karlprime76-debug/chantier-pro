import type { ReactNode } from "react";

import { redirect } from "next/navigation";

import { requireSession } from "@/lib/auth/guards";
import { canAccessFeature, type FeatureKey } from "@/lib/subscription/access";
import { getEffectiveUserPlan } from "@/lib/subscription/server";

type FeatureGateProps = {
  featureKey: FeatureKey;
  children: ReactNode;
  lockTitle?: string;
  lockDescription?: string;
};

export async function FeatureGate({
  featureKey,
  children,
}: FeatureGateProps) {
  const session = await requireSession();
  if (!session) {
    redirect("/login?next=/dashboard");
  }

  const plan = await getEffectiveUserPlan(session);
  const ok = canAccessFeature(plan, featureKey);

  if (!ok) {
    redirect(`/pricing?locked=${encodeURIComponent(featureKey)}`);
  }

  return <>{children}</>;
}
