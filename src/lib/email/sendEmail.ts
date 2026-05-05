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

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const provider = (process.env.EMAIL_PROVIDER ?? "").trim().toLowerCase();
  const resendKey = (process.env.RESEND_API_KEY ?? "").trim();
  const from = (process.env.EMAIL_FROM ?? "").trim() || "Chantier Pro <onboarding@resend.dev>";

  if (provider !== "resend" || !resendKey) {
    const baseUrl = getBaseUrl();
    const safeText = (input.text ?? "").slice(0, 500);

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
    console.error("[email:resend] Failed to send email.", { to: input.to, subject: input.subject, error });
    return { ok: false, provider: "resend", error };
  }
}

export function getAppUrl() {
  return getBaseUrl();
}
