import { NextResponse } from "next/server";

import type { SessionUser } from "@/lib/auth/session";
import { canAccessFeature, getUserPlanFromRole, type FeatureKey } from "@/lib/subscription/access";

export function featureLockedResponse(message = "Cette fonctionnalité est réservée aux utilisateurs Pro.") {
  return NextResponse.json({ ok: false, error: "feature_locked", message }, { status: 403 });
}

export function assertApiFeatureAccess(session: SessionUser, featureKey: FeatureKey) {
  const plan = getUserPlanFromRole(session.role);
  const ok = canAccessFeature(plan, featureKey);

  if (!ok) {
    throw featureLockedResponse();
  }
}
