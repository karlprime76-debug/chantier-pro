import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth/session";

export async function requireApiSession() {
  const session = await getSession();
  if (!session) {
    throw NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  return session;
}

function isTruthyEnv(value: string | undefined) {
  const v = (value ?? "").trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

function parseAllowedEmails(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireApiAdmin() {
  const session = await requireApiSession();
  if (session.role !== "ADMIN") {
    throw NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const accessEnabled = process.env.ADMIN_ACCESS_ENABLED;
  if (accessEnabled !== undefined && !isTruthyEnv(accessEnabled)) {
    throw NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const allowedEmails = parseAllowedEmails(process.env.ADMIN_ALLOWED_EMAILS);
  if (allowedEmails.length) {
    const email = (session.email ?? "").trim().toLowerCase();
    if (!email || !allowedEmails.includes(email)) {
      throw NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
    }
  }

  return session;
}
