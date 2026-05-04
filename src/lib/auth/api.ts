import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth/session";

export async function requireApiSession() {
  const session = await getSession();
  if (!session) {
    throw NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  return session;
}
