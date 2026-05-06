import { NextResponse } from "next/server";

import { requireApiSession } from "@/lib/auth/api";

type BillingHealthResponse = {
  ok: boolean;
  paydunyaConfigured: boolean;
  appUrlConfigured: boolean;
  appUrlDetected: string | null;
  missing: string[];
  provider: "paydunya";
  environment: "server";
  message: string;
};

function getAppUrlConfig() {
  const appUrl = process.env.APP_URL?.trim() || "";
  const nextAuthUrl = process.env.NEXTAUTH_URL?.trim() || "";

  if (appUrl) return { configured: true, detected: appUrl.replace(/\/$/, ""), usedFallback: false };
  if (nextAuthUrl) return { configured: true, detected: nextAuthUrl.replace(/\/$/, ""), usedFallback: true };
  return { configured: false, detected: null as string | null, usedFallback: false };
}

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    const session = await requireApiSession();
    if (session.role !== "ADMIN") {
      return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
    }
  }

  const missing: string[] = [];

  const apiKey = process.env.PAYDUNYA_API_KEY?.trim() || "";
  const apiSecret = process.env.PAYDUNYA_API_SECRET?.trim() || "";
  const masterKey = process.env.PAYDUNYA_MASTER_KEY?.trim() || "";

  if (!apiKey) missing.push("PAYDUNYA_API_KEY");
  if (!apiSecret) missing.push("PAYDUNYA_API_SECRET");
  if (!masterKey) missing.push("PAYDUNYA_MASTER_KEY");

  const appUrlConfig = getAppUrlConfig();
  if (!appUrlConfig.configured) missing.push("APP_URL");

  const paydunyaConfigured = !missing.includes("PAYDUNYA_API_KEY") && !missing.includes("PAYDUNYA_API_SECRET") && !missing.includes("PAYDUNYA_MASTER_KEY");
  const appUrlConfigured = appUrlConfig.configured;

  let message = "";
  if (paydunyaConfigured && appUrlConfigured) {
    message = "Configuration PayDunya complète.";
  } else {
    const missingText = missing.length ? missing.join(", ") : "inconnue";
    message = `Configuration PayDunya incomplète : ${missingText} manquant.`;
  }

  if (!process.env.APP_URL?.trim() && process.env.NEXTAUTH_URL?.trim()) {
    message = `${message} APP_URL absent, fallback NEXTAUTH_URL utilisé.`;
  }

  const res: BillingHealthResponse = {
    ok: paydunyaConfigured && appUrlConfigured,
    paydunyaConfigured,
    appUrlConfigured,
    appUrlDetected: appUrlConfig.detected,
    missing,
    provider: "paydunya",
    environment: "server",
    message,
  };

  return NextResponse.json(res);
}
