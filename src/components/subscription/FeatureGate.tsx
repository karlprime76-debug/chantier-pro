import type { ReactNode } from "react";

import { redirect } from "next/navigation";

import { requireSession } from "@/lib/auth/guards";
import { canAccessFeature, getUserPlanFromRole, type FeatureKey } from "@/lib/subscription/access";

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
    redirect("/login");
  }

  const plan = getUserPlanFromRole(session.role);
  const ok = canAccessFeature(plan, featureKey);

  if (!ok) {
    redirect("/pricing");
  }

  return <>{children}</>;
}
