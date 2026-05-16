import { NextResponse } from "next/server";
import { z } from "zod";

import { requireApiAdmin } from "@/lib/auth/api";
import { sendTransactionalEmail } from "@/lib/email/resend";
import { getRequestId, withRequestIdHeaders } from "@/lib/observability/requestId";

const Schema = z.object({
  to: z.string().email().optional(),
});

export async function POST(req: Request) {
  const requestId = getRequestId(req);

  let session;
  try {
    session = await requireApiAdmin();
  } catch (e) {
    if (e instanceof Response) return withRequestIdHeaders(e, requestId);
    return withRequestIdHeaders(NextResponse.json({ ok: false, error: "forbidden", requestId }, { status: 403 }), requestId);
  }

  const json = await req.json().catch(() => null);
  const parsed = Schema.safeParse(json ?? {});
  if (!parsed.success) {
    return withRequestIdHeaders(
      NextResponse.json({ ok: false, error: "invalid_payload", issues: parsed.error.issues, requestId }, { status: 400 }),
      requestId,
    );
  }

  const to = (parsed.data.to ?? session.email ?? "").trim().toLowerCase();
  if (!to) {
    return withRequestIdHeaders(
      NextResponse.json({ ok: false, error: "missing_to", message: "Aucun email destinataire.", requestId }, { status: 400 }),
      requestId,
    );
  }

  const result = await sendTransactionalEmail({
    to,
    subject: "Test email Chantier Pro",
    text: "Ceci est un email de test (admin) depuis Chantier Pro.",
    html: "<p>Ceci est un email de test (admin) depuis <strong>Chantier Pro</strong>.</p>",
  });

  if (!result.ok) {
    return withRequestIdHeaders(
      NextResponse.json({ ok: false, error: "send_failed", details: result.error, requestId }, { status: 502 }),
      requestId,
    );
  }

  return withRequestIdHeaders(
    NextResponse.json({ ok: true, provider: result.provider, id: result.id, to, requestId }, { status: 200 }),
    requestId,
  );
}
