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

export function getPublicAppUrl() {
  return getAppUrl();
}

export async function sendTransactionalEmail(input: SendTransactionalEmailInput): Promise<SendTransactionalEmailResult> {
  const resendKey = (process.env.RESEND_API_KEY ?? "").trim();
  const from = (process.env.EMAIL_FROM ?? "").trim();
  const replyTo = (input.replyTo ?? process.env.EMAIL_REPLY_TO ?? "").trim();

  const baseUrl = getAppUrl();
  if (process.env.NODE_ENV === "production" && isLocalhostUrl(baseUrl)) {
    return { ok: false, provider: "resend", error: "Invalid APP_URL/NEXTAUTH_URL: points to localhost in production." };
  }

  if (!resendKey) return { ok: false, provider: "resend", error: "Missing RESEND_API_KEY." };
  if (!from) return { ok: false, provider: "resend", error: "Missing EMAIL_FROM." };

  const to = normalizeEmail(input.to);
  if (!looksLikeEmail(to)) return { ok: false, provider: "resend", error: "Invalid recipient email." };

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

    if (error) {
      console.error("[email:resend] send failed", {
        to,
        subject: input.subject,
        message: error.message,
        name: error.name,
      });
      return { ok: false, provider: "resend", error: error.message };
    }

    const id = typeof data?.id === "string" && data.id ? data.id : "unknown";
    return { ok: true, provider: "resend", id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    console.error("[email:resend] exception", { to, subject: input.subject, message });
    return { ok: false, provider: "resend", error: message };
  }
}
