import { NextResponse } from "next/server";

import type { SessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { canAccessFeature, normalizeUserPlan, type FeatureKey } from "@/lib/subscription/access";

export function featureLockedResponse(message = "Cette fonctionnalité est réservée aux utilisateurs Pro.") {
  return NextResponse.json({ ok: false, error: "feature_locked", message }, { status: 403 });
}

export async function getEffectiveUserPlan(session: SessionUser) {
  const user = (await prisma.user.findUnique({
    where: { id: session.id },
    select: { plan: true } as never,
  })) as unknown as { plan?: string | null } | null;
  return normalizeUserPlan(user?.plan ?? null, session.role);
}

export async function assertApiFeatureAccess(session: SessionUser, featureKey: FeatureKey) {
  const plan = await getEffectiveUserPlan(session);
  const ok = canAccessFeature(plan, featureKey);

  if (!ok) {
    throw featureLockedResponse();
  }
}
