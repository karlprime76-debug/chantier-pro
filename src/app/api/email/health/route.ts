import { NextResponse } from "next/server";

import { requireApiSession } from "@/lib/auth/api";
import { logInfo } from "@/lib/observability/logger";
import { getRequestId, withRequestIdHeaders } from "@/lib/observability/requestId";

type EmailHealthResponse = {
  ok: boolean;
  provider: "resend" | "none" | "unknown";
  emailProviderConfigured: boolean;
  resendConfigured: boolean;
  emailFromConfigured: boolean;
  appUrlConfigured: boolean;
  appUrlDetected: string | null;
  missing: string[];
  message: string;
};

function getAppUrlConfig() {
  const appUrl = process.env.APP_URL?.trim() || "";
  const nextAuthUrl = process.env.NEXTAUTH_URL?.trim() || "";

  if (appUrl) return { configured: true, detected: appUrl.replace(/\/$/, ""), usedFallback: false };
  if (nextAuthUrl) return { configured: true, detected: nextAuthUrl.replace(/\/$/, ""), usedFallback: true };
  return { configured: false, detected: null as string | null, usedFallback: false };
}

export async function GET(req: Request) {
  const requestId = getRequestId(req);
  logInfo("email.health.request_received", { requestId });

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

  const providerRaw = (process.env.EMAIL_PROVIDER ?? "").trim().toLowerCase();
  const provider: EmailHealthResponse["provider"] =
    providerRaw === "resend" ? "resend" : providerRaw ? "unknown" : "none";

  const resendKey = (process.env.RESEND_API_KEY ?? "").trim();
  const emailFrom = (process.env.EMAIL_FROM ?? "").trim();

  const emailProviderConfigured = provider !== "none";
  const resendConfigured = provider === "resend" && Boolean(resendKey);
  const emailFromConfigured = Boolean(emailFrom);

  if (!providerRaw) missing.push("EMAIL_PROVIDER");
  if (providerRaw === "resend" && !resendKey) missing.push("RESEND_API_KEY");
  if (!emailFrom) missing.push("EMAIL_FROM");

  const appUrlConfig = getAppUrlConfig();
  const appUrlConfigured = appUrlConfig.configured;
  if (!appUrlConfigured) missing.push("APP_URL");

  const ok = resendConfigured && emailFromConfigured && appUrlConfigured;

  let message = ok ? "Configuration email complète." : `Configuration email incomplète : ${missing.join(", ")} manquant.`;
  if (!process.env.APP_URL?.trim() && process.env.NEXTAUTH_URL?.trim()) {
    message = `${message} APP_URL absent, fallback NEXTAUTH_URL utilisé.`;
  }

  const res: EmailHealthResponse = {
    ok,
    provider,
    emailProviderConfigured,
    resendConfigured,
    emailFromConfigured,
    appUrlConfigured,
    appUrlDetected: appUrlConfig.detected,
    missing,
    message,
  };

  return withRequestIdHeaders(NextResponse.json({ ...res, requestId }), requestId);
}
