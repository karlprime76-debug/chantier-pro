import { NextResponse } from "next/server";

import { requireApiSession } from "@/lib/auth/api";
import { logInfo } from "@/lib/observability/logger";
import { getRequestId, withRequestIdHeaders } from "@/lib/observability/requestId";

type BillingHealthResponse = {
  ok: boolean;
  paydunyaConfigured: boolean;
  appUrlConfigured: boolean;
  appUrlDetected: string | null;
  paydunyaEnv: string | null;
  paydunyaEndpoint: string;
  missing: string[];
  provider: "paydunya";
  environment: "server";
  message: string;
  requestId: string;
};

function getPayDunyaBaseUrl() {
  const override = process.env.PAYDUNYA_BASE_URL?.trim();
  if (override) return override;

  const env = (process.env.PAYDUNYA_ENV ?? "").trim().toLowerCase();
  if (env === "test" || env === "sandbox") {
    return "https://app.paydunya.com/sandbox-api/v1";
  }

  return "https://app.paydunya.com/api/v1";
}

function getAppUrlConfig() {
  const appUrl = process.env.APP_URL?.trim() || "";
  const nextAuthUrl = process.env.NEXTAUTH_URL?.trim() || "";

  if (appUrl) return { configured: true, detected: appUrl.replace(/\/$/, ""), usedFallback: false };
  if (nextAuthUrl) return { configured: true, detected: nextAuthUrl.replace(/\/$/, ""), usedFallback: true };
  return { configured: false, detected: null as string | null, usedFallback: false };
}

export async function GET(req: Request) {
  const requestId = getRequestId(req);
  logInfo("billing.health.request_received", { requestId });

  if (process.env.NODE_ENV === "production") {
    const session = await requireApiSession();
    if (session.role !== "ADMIN") {
      return withRequestIdHeaders(
        NextResponse.json({ ok: false, error: "forbidden", requestId }, { status: 403 }),
        requestId,
      );
    }
  }

  const missing: string[] = [];

  const apiKey = process.env.PAYDUNYA_API_KEY?.trim() || "";
  const apiSecret = process.env.PAYDUNYA_API_SECRET?.trim() || "";
  const masterKey = process.env.PAYDUNYA_MASTER_KEY?.trim() || "";
  const privateKey = process.env.PAYDUNYA_PRIVATE_KEY?.trim() || "";
  const token = process.env.PAYDUNYA_TOKEN?.trim() || "";

  const hasPrivateFlow = Boolean(masterKey && privateKey && token);
  const hasApiFlow = Boolean(masterKey && apiKey && apiSecret);

  if (!masterKey) missing.push("PAYDUNYA_MASTER_KEY");

  if (!hasPrivateFlow && !hasApiFlow) {
    if (!privateKey) missing.push("PAYDUNYA_PRIVATE_KEY");
    if (!token) missing.push("PAYDUNYA_TOKEN");
    if (!apiKey) missing.push("PAYDUNYA_API_KEY");
    if (!apiSecret) missing.push("PAYDUNYA_API_SECRET");
  }

  const appUrlConfig = getAppUrlConfig();
  if (!appUrlConfig.configured) missing.push("APP_URL");

  const paydunyaConfigured = hasPrivateFlow || hasApiFlow;
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
    paydunyaEnv: (process.env.PAYDUNYA_ENV ?? "").trim() || null,
    paydunyaEndpoint: `${getPayDunyaBaseUrl()}/checkout-invoice/create`,
    missing,
    provider: "paydunya",
    environment: "server",
    message,
    requestId,
  };

  return withRequestIdHeaders(NextResponse.json(res), requestId);
}
