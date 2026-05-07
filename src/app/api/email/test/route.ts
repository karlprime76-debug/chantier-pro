import { NextResponse } from "next/server";
import { z } from "zod";

import { sendEmail } from "@/lib/email/sendEmail";
import { logError, logInfo } from "@/lib/observability/logger";
import { getRequestId, withRequestIdHeaders } from "@/lib/observability/requestId";

const TestEmailSchema = z.object({
  to: z.string().email(),
});

export async function POST(req: Request) {
  const requestId = getRequestId(req);
  logInfo("email.test.request_received", { requestId });

  const secretRequired = (process.env.EMAIL_TEST_SECRET ?? "").trim();
  if (secretRequired) {
    const provided = req.headers.get("x-email-test-secret") ?? "";
    if (provided !== secretRequired) {
      return withRequestIdHeaders(
        NextResponse.json({ ok: false, error: "unauthorized", requestId }, { status: 401 }),
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
        { ok: false, error: "invalid_payload", issues: parsed.error.issues, requestId },
        { status: 400 },
      ),
      requestId,
    );
  }

  logInfo("email.test.sending", { requestId, to: parsed.data.to });

  const result = await sendEmail({
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
        { ok: false, error: "send_failed", provider: result.provider, message: result.error, requestId },
        { status: 502 },
      ),
      requestId,
    );
  }

  logInfo("email.test.send_ok", { requestId, provider: result.provider });
  return withRequestIdHeaders(
    NextResponse.json({ ok: true, provider: result.provider, requestId }),
    requestId,
  );
}
