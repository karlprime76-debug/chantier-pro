import { NextResponse } from "next/server";

import { requireApiAdmin } from "@/lib/auth/api";
import { getPublicAppUrl } from "@/lib/email/resend";
import { getRequestId, withRequestIdHeaders } from "@/lib/observability/requestId";

function getEmailFromDomain(emailFrom: string) {
  const m = emailFrom.match(/<([^>]+)>/);
  const raw = (m?.[1] ?? emailFrom).trim();
  const at = raw.lastIndexOf("@");
  if (at === -1) return null;
  return raw.slice(at + 1).toLowerCase();
}

export async function GET(req: Request) {
  const requestId = getRequestId(req);

  try {
    await requireApiAdmin();
  } catch (e) {
    if (e instanceof Response) return withRequestIdHeaders(e, requestId);
    return withRequestIdHeaders(NextResponse.json({ ok: false, error: "forbidden", requestId }, { status: 403 }), requestId);
  }

  const resendKey = (process.env.RESEND_API_KEY ?? "").trim();
  const emailFrom = (process.env.EMAIL_FROM ?? "").trim();
  const emailReplyTo = (process.env.EMAIL_REPLY_TO ?? "").trim();
  const appUrl = getPublicAppUrl();

  return withRequestIdHeaders(
    NextResponse.json(
      {
        ok: true,
        hasResendApiKey: Boolean(resendKey),
        hasEmailFrom: Boolean(emailFrom),
        hasEmailReplyTo: Boolean(emailReplyTo),
        emailFromDomain: emailFrom ? getEmailFromDomain(emailFrom) : null,
        hasAppUrl: Boolean(appUrl),
        appUrl,
        nodeEnv: process.env.NODE_ENV ?? "unknown",
        requestId,
      },
      { status: 200 },
    ),
    requestId,
  );
}
