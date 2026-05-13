import { NextResponse } from "next/server";

import { requireApiAdmin } from "@/lib/auth/api";
import { logInfo } from "@/lib/observability/logger";
import { getRequestId, withRequestIdHeaders } from "@/lib/observability/requestId";

type EmailHealthResponse = {
  ok: boolean;
  provider: "resend" | "none" | "unknown";
  emailProviderConfigured: boolean;
  resendConfigured: boolean;
  emailFromConfigured: boolean;
  appUrlConfigured: boolean;
  nextAuthUrlConfigured: boolean;
  appUrlDetected: string | null;
  appUrlSource: "APP_URL" | "NEXTAUTH_URL" | "none";
  appUrlLooksLocalhost: boolean;
  missing: string[];
  message: string;
};

function getAppUrlConfig() {
  const appUrl = process.env.APP_URL?.trim() || "";
  const nextAuthUrl = process.env.NEXTAUTH_URL?.trim() || "";

  if (appUrl) return { configured: true, detected: appUrl.replace(/\/$/, ""), source: "APP_URL" as const };
  if (nextAuthUrl) return { configured: true, detected: nextAuthUrl.replace(/\/$/, ""), source: "NEXTAUTH_URL" as const };
  return { configured: false, detected: null as string | null, source: "none" as const };
}

function looksLikeLocalhost(url: string | null) {
  if (!url) return false;
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\b/i.test(url);
}

export async function GET(req: Request) {
  const requestId = getRequestId(req);
  logInfo("email.health.request_received", { requestId });

  if (process.env.NODE_ENV === "production") {
    try {
      await requireApiAdmin();
    } catch (e) {
      if (e instanceof Response) return withRequestIdHeaders(e, requestId);
      return withRequestIdHeaders(NextResponse.json({ ok: false, error: "forbidden", requestId }, { status: 403 }), requestId);
    }
  }

  const missing: string[] = [];

  const providerRaw = (process.env.EMAIL_PROVIDER ?? "").trim().toLowerCase();
  const provider: EmailHealthResponse["provider"] =
    providerRaw === "resend" ? "resend" : providerRaw ? "unknown" : "none";

  const resendKey = (process.env.RESEND_API_KEY ?? "").trim();
  const emailFrom = (process.env.EMAIL_FROM ?? "").trim();
  const nextAuthUrl = (process.env.NEXTAUTH_URL ?? "").trim();

  const emailProviderConfigured = provider !== "none";
  const resendConfigured = provider === "resend" && Boolean(resendKey);
  const emailFromConfigured = Boolean(emailFrom);
  const nextAuthUrlConfigured = Boolean(nextAuthUrl);

  if (!providerRaw) missing.push("EMAIL_PROVIDER");
  if (providerRaw === "resend" && !resendKey) missing.push("RESEND_API_KEY");
  if (!emailFrom) missing.push("EMAIL_FROM");

  const appUrlConfig = getAppUrlConfig();
  const appUrlConfigured = appUrlConfig.configured;
  if (!appUrlConfigured) missing.push("APP_URL");

  const appUrlLooksLocalhost = looksLikeLocalhost(appUrlConfig.detected);
  if (process.env.NODE_ENV === "production" && appUrlLooksLocalhost) {
    missing.push("APP_URL_VALID_PUBLIC");
  }

  const ok = resendConfigured && emailFromConfigured && appUrlConfigured && !appUrlLooksLocalhost;

  let message = ok ? "Configuration email complète." : `Configuration email incomplète : ${missing.join(", ")} manquant.`;
  if (appUrlConfig.source === "NEXTAUTH_URL") {
    message = `${message} APP_URL absent, fallback NEXTAUTH_URL utilisé.`;
  }
  if (process.env.NODE_ENV === "production" && appUrlLooksLocalhost) {
    message = `${message} URL détectée invalide en production (localhost).`;
  }

  const res: EmailHealthResponse = {
    ok,
    provider,
    emailProviderConfigured,
    resendConfigured,
    emailFromConfigured,
    appUrlConfigured,
    nextAuthUrlConfigured,
    appUrlDetected: appUrlConfig.detected,
    appUrlSource: appUrlConfig.source,
    appUrlLooksLocalhost,
    missing,
    message,
  };

  return withRequestIdHeaders(NextResponse.json({ ...res, requestId }), requestId);
}
