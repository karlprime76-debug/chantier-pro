import { NextResponse } from "next/server";
import { z } from "zod";

import { requireApiAdmin } from "@/lib/auth/api";
import { sendTransactionalEmail } from "@/lib/email/resend";
import { logError, logInfo } from "@/lib/observability/logger";
import { getRequestId, withRequestIdHeaders } from "@/lib/observability/requestId";

const TestEmailSchema = z.object({
  to: z.string().email(),
});

export async function POST(req: Request) {
  const requestId = getRequestId(req);
  logInfo("email.test.request_received", { requestId });

  const secretRequired = (process.env.EMAIL_TEST_SECRET ?? "").trim();
  if (process.env.NODE_ENV === "production" && !secretRequired) {
    try {
      await requireApiAdmin();
    } catch (e) {
      if (e instanceof Response) return withRequestIdHeaders(e, requestId);
      return withRequestIdHeaders(
        NextResponse.json({ ok: false, error: "forbidden", message: "Accès refusé.", requestId }, { status: 403 }),
        requestId,
      );
    }
  }

  if (secretRequired) {
    const provided = req.headers.get("x-email-test-secret") ?? "";
    if (provided !== secretRequired) {
      return withRequestIdHeaders(
        NextResponse.json({ ok: false, error: "unauthorized", message: "Secret invalide.", requestId }, { status: 401 }),
        requestId,
      );
    }
  }

  const json = await req.json().catch(() => null);
  const parsed = TestEmailSchema.safeParse(json);
  if (!parsed.success) {
    logInfo("email.test.invalid_payload", { requestId });
    return withRequestIdHeaders(
      NextResponse.json(
        { ok: false, error: "invalid_payload", message: "Payload invalide.", issues: parsed.error.issues, requestId },
        { status: 400 },
      ),
      requestId,
    );
  }

  logInfo("email.test.sending", { requestId, to: parsed.data.to });

  const result = await sendTransactionalEmail({
    to: parsed.data.to,
    subject: "Test email Chantier Pro",
    text: "Ceci est un email de test depuis Chantier Pro.",
    html: "<p>Ceci est un email de test depuis <strong>Chantier Pro</strong>.</p>",
  });

  if (!result.ok) {
    logError("email.test.send_failed", {
      requestId,
      provider: result.provider,
      message: result.error,
    });
    return withRequestIdHeaders(
      NextResponse.json(
        {
          ok: false,
          error: "send_failed",
          message: "Envoi email test impossible.",
          details: result.error,
          provider: result.provider,
          requestId,
        },
        { status: 502 },
      ),
      requestId,
    );
  }

  logInfo("email.test.send_ok", { requestId, provider: result.provider, id: result.id });
  return withRequestIdHeaders(
    NextResponse.json({ ok: true, message: "Email test envoyé.", provider: result.provider, id: result.id, requestId }),
    requestId,
  );
}
