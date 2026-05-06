import { NextResponse } from "next/server";
import { z } from "zod";

import { sendEmail } from "@/lib/email/sendEmail";

const TestEmailSchema = z.object({
  to: z.string().email(),
});

export async function POST(req: Request) {
  const secretRequired = (process.env.EMAIL_TEST_SECRET ?? "").trim();
  if (secretRequired) {
    const provided = req.headers.get("x-email-test-secret") ?? "";
    if (provided !== secretRequired) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  }

  const json = await req.json().catch(() => null);
  const parsed = TestEmailSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_payload", issues: parsed.error.issues }, { status: 400 });
  }

  const result = await sendEmail({
    to: parsed.data.to,
    subject: "Test email Chantier Pro",
    text: "Ceci est un email de test depuis Chantier Pro.",
    html: "<p>Ceci est un email de test depuis <strong>Chantier Pro</strong>.</p>",
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: "send_failed", provider: result.provider, message: result.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true, provider: result.provider });
}
