import "server-only";

import { Resend } from "resend";
import type { CreateEmailOptions } from "resend";
import type { ReactElement } from "react";

export type SendTransactionalEmailInput = {
  to: string;
  subject: string;
  react?: ReactElement;
  html?: string;
  text?: string;
  replyTo?: string;
};

export type SendTransactionalEmailResult =
  | { ok: true; id: string; provider: "resend" }
  | { ok: false; provider: "resend"; error: string };

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function looksLikeEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function maskEmail(value: string) {
  const [local = "", domain = ""] = value.split("@");
  const maskedLocal = local.length <= 2 ? `${local.slice(0, 1)}***` : `${local.slice(0, 2)}***${local.slice(-1)}`;
  return domain ? `${maskedLocal}@${domain}` : "***";
}

function getErrorStatusCode(error: unknown) {
  if (typeof error !== "object" || error === null || !("statusCode" in error)) return undefined;
  const statusCode = (error as { statusCode?: unknown }).statusCode;
  return typeof statusCode === "number" || typeof statusCode === "string" ? statusCode : undefined;
}

function getAppUrl() {
  const fromAppUrl = (process.env.APP_URL ?? "").trim();
  if (fromAppUrl) return fromAppUrl.replace(/\/$/, "");

  const fromNextAuthUrl = (process.env.NEXTAUTH_URL ?? "").trim();
  if (fromNextAuthUrl) return fromNextAuthUrl.replace(/\/$/, "");

  return "http://localhost:3000";
}

function isLocalhostUrl(url: string) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\b/i.test(url.trim());
}

function getEmailFrom() {
  const configured = (process.env.EMAIL_FROM ?? "").trim();
  if (configured) return configured;
  if (process.env.NODE_ENV === "production") return "Chantier Pro <noreply@chantierpro.xyz>";
  return "Chantier Pro <onboarding@resend.dev>";
}

function getReplyTo(inputReplyTo?: string) {
  return (
    inputReplyTo ??
    process.env.EMAIL_REPLY_TO ??
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL ??
    "chantierprobj@gmail.com"
  ).trim();
}

export function getPublicAppUrl() {
  return getAppUrl();
}

export async function sendTransactionalEmail(input: SendTransactionalEmailInput): Promise<SendTransactionalEmailResult> {
  const resendKey = (process.env.RESEND_API_KEY ?? "").trim();
  const from = getEmailFrom();
  const replyTo = getReplyTo(input.replyTo);

  const baseUrl = getAppUrl();
  console.log("[email] config", {
    hasResendKey: Boolean(resendKey),
    from,
    replyTo,
    appUrl: baseUrl,
    nodeEnv: process.env.NODE_ENV,
  });

  if (process.env.NODE_ENV === "production" && isLocalhostUrl(baseUrl)) {
    console.error("[email] blocked", { reason: "production_localhost_app_url", appUrl: baseUrl });
    return { ok: false, provider: "resend", error: "Invalid APP_URL/NEXTAUTH_URL: points to localhost in production." };
  }

  if (!resendKey) {
    console.error("[email] blocked", { reason: "missing_resend_api_key" });
    return { ok: false, provider: "resend", error: "Missing RESEND_API_KEY." };
  }

  const to = normalizeEmail(input.to);
  if (!looksLikeEmail(to)) {
    console.error("[email] blocked", { reason: "invalid_recipient_email", to: maskEmail(to) });
    return { ok: false, provider: "resend", error: "Invalid recipient email." };
  }

  const html = typeof input.html === "string" ? input.html : undefined;
  const text = typeof input.text === "string" ? input.text : undefined;

  const payload: CreateEmailOptions = {
    from,
    to,
    subject: input.subject,
    ...(input.react ? { react: input.react } : html ? { html } : { text: text ?? "" }),
    ...(replyTo ? { replyTo } : {}),
  };

  try {
    const resend = new Resend(resendKey);
    const { data, error } = await resend.emails.send(payload);

    console.log("[email] resend result", {
      ok: Boolean(data?.id),
      id: data?.id,
      to: maskEmail(to),
      subject: input.subject,
      error: error
        ? {
            name: error.name,
            message: error.message,
            statusCode: getErrorStatusCode(error),
          }
        : null,
    });

    if (error) {
      console.error("[email:resend] send failed", {
        to: maskEmail(to),
        subject: input.subject,
        message: error.message,
        name: error.name,
        statusCode: getErrorStatusCode(error),
      });
      return { ok: false, provider: "resend", error: error.message };
    }

    const id = typeof data?.id === "string" && data.id ? data.id : "unknown";
    return { ok: true, provider: "resend", id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    console.error("[email:resend] exception", { to: maskEmail(to), subject: input.subject, message });
    return { ok: false, provider: "resend", error: message };
  }
}
