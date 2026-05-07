import { Resend } from "resend";
import type { CreateEmailOptions } from "resend";

type SendEmailInput = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
};

type SendEmailResult =
  | { ok: true; provider: "fallback" | "resend" }
  | { ok: false; provider: "resend"; error: string };

function getBaseUrl() {
  const fromAppUrl = (process.env.APP_URL ?? "").trim();
  if (fromAppUrl) return fromAppUrl;

  const fromNextAuthUrl = (process.env.NEXTAUTH_URL ?? "").trim();
  if (fromNextAuthUrl) return fromNextAuthUrl;

  return "http://localhost:3000";
}

function isLocalhostUrl(url: string) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\b/i.test(url.trim());
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const provider = (process.env.EMAIL_PROVIDER ?? "").trim().toLowerCase();
  const resendKey = (process.env.RESEND_API_KEY ?? "").trim();
  const from = (process.env.EMAIL_FROM ?? "").trim() || "Chantier Pro <onboarding@resend.dev>";

  const baseUrl = getBaseUrl();
  if (process.env.NODE_ENV === "production" && isLocalhostUrl(baseUrl)) {
    return {
      ok: false,
      provider: "resend",
      error: "Invalid APP_URL/NEXTAUTH_URL: points to localhost in production.",
    };
  }

  if (provider !== "resend" || !resendKey) {
    const safeText = (input.text ?? "").slice(0, 500);

    if (process.env.NODE_ENV === "production") {
      return {
        ok: false,
        provider: "resend",
        error:
          "Email provider not configured. Set EMAIL_PROVIDER=resend and RESEND_API_KEY (and a valid EMAIL_FROM).",
      };
    }

    console.info("[email:fallback] Email provider not configured; logging email instead.", {
      to: input.to,
      subject: input.subject,
      baseUrl,
      hasHtml: Boolean(input.html),
      textPreview: safeText || undefined,
    });

    return { ok: true, provider: "fallback" };
  }

  try {
    const resend = new Resend(resendKey);

    const payload: CreateEmailOptions =
      typeof input.html === "string"
        ? {
            from,
            to: input.to,
            subject: input.subject,
            html: input.html,
          }
        : {
            from,
            to: input.to,
            subject: input.subject,
            text: typeof input.text === "string" ? input.text : "",
          };

    await resend.emails.send(payload);

    return { ok: true, provider: "resend" };
  } catch (err) {
    const error = err instanceof Error ? err.message : "unknown";
    const extra =
      typeof err === "object" && err !== null
        ? {
            name: "name" in err ? String((err as { name?: unknown }).name) : undefined,
            statusCode: "statusCode" in err ? String((err as { statusCode?: unknown }).statusCode) : undefined,
          }
        : {};
    console.error("[email:resend] Failed to send email.", {
      to: input.to,
      subject: input.subject,
      error,
      ...extra,
    });
    return { ok: false, provider: "resend", error: extra.statusCode ? `${error} (status ${extra.statusCode})` : error };
  }
}

export function getAppUrl() {
  return getBaseUrl();
}
