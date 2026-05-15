import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { getAppUrl, sendEmail } from "@/lib/email/sendEmail";
import { buildWelcomeEmail } from "@/lib/email/templates";
import { logError, logInfo } from "@/lib/observability/logger";
import { getRequestId, withRequestIdHeaders } from "@/lib/observability/requestId";

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  const requestId = getRequestId(req);
  try {
    logInfo("auth.register.request_received", { requestId });
    const json = await req.json().catch(() => null);
    const parsed = RegisterSchema.safeParse(json);
    if (!parsed.success) {
      logInfo("auth.register.invalid_payload", { requestId });
      return withRequestIdHeaders(
        NextResponse.json(
          { ok: false, error: "invalid_payload", issues: parsed.error.issues, requestId },
          { status: 400 },
        ),
        requestId,
      );
    }

    const email = parsed.data.email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) {
      logInfo("auth.register.email_already_used", { requestId });
      return withRequestIdHeaders(
        NextResponse.json({ ok: false, error: "email_already_used", requestId }, { status: 409 }),
        requestId,
      );
    }

    const passwordHash = await hashPassword(parsed.data.password);

    const companyName = parsed.data.company.trim();
    const userName = parsed.data.name.trim();

    const company = await prisma.company.upsert({
      where: { name: companyName },
      create: { name: companyName },
      update: {},
      select: { id: true },
    });

    const user = await prisma.user.create({
      data: {
        email,
        name: userName,
        passwordHash,
        role: "PROFESSIONAL",
        companyId: company.id,
      },
      select: { id: true },
    });

    logInfo("auth.register.user_created", { requestId, userId: user.id });

    const appUrl = getAppUrl();
    const dashboardUrl = `${appUrl.replace(/\/$/, "")}/dashboard`;

    const welcome = buildWelcomeEmail({ name: userName, dashboardUrl });

    sendEmail({
      to: email,
      subject: welcome.subject,
      text: welcome.text,
      html: welcome.html,
    }).then((result) => {
      if (!result.ok) {
        logError("auth.register.welcome_email_failed", { requestId, userId: user.id, error: result.error });
        return;
      }

      logInfo("auth.register.welcome_email_sent", { requestId, userId: user.id, provider: result.provider });
    });

    return withRequestIdHeaders(NextResponse.json({ ok: true, userId: user.id, requestId }), requestId);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    logError("auth.register.server_error", { requestId, error: message });
    return withRequestIdHeaders(
      NextResponse.json({ ok: false, error: "server_error", message, requestId }, { status: 500 }),
      requestId,
    );
  }
}
