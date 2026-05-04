import type { ReactNode } from "react";

import { requireSession } from "@/lib/auth/guards";
import { canAccessFeature, getUserPlanFromRole, type FeatureKey } from "@/lib/subscription/access";

import { PremiumLock } from "@/components/subscription/PremiumLock";

type FeatureGateProps = {
  featureKey: FeatureKey;
  children: ReactNode;
  lockTitle?: string;
  lockDescription?: string;
};

export async function FeatureGate({
  featureKey,
  children,
  lockTitle,
  lockDescription,
}: FeatureGateProps) {
  const session = await requireSession();
  if (!session) return <PremiumLock title={lockTitle} description={lockDescription} />;

  const plan = getUserPlanFromRole(session.role);
  const ok = canAccessFeature(plan, featureKey);

  if (!ok) return <PremiumLock title={lockTitle} description={lockDescription} />;

  return <>{children}</>;
}
