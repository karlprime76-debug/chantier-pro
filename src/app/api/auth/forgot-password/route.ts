import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";

import { prisma } from "@/lib/db/prisma";
import { getAppUrl, sendEmail } from "@/lib/email/sendEmail";
import { buildPasswordResetEmail } from "@/lib/email/templates";
import { logError, logInfo } from "@/lib/observability/logger";
import { getRequestId, withRequestIdHeaders } from "@/lib/observability/requestId";
import { checkRateLimit } from "@/lib/security/rateLimit";

const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

const GENERIC_MESSAGE =
  "Si un compte existe avec cet email, un lien de réinitialisation sera envoyé.";

function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function POST(req: Request) {
  const requestId = getRequestId(req);
  try {
    logInfo("auth.forgot_password.request_received", { requestId });

    const rl = checkRateLimit(req, {
      keyPrefix: "auth.forgot_password",
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (!rl.allowed) {
      logInfo("auth.forgot_password.rate_limited", { requestId });
      return withRequestIdHeaders(
        NextResponse.json({ ok: true, message: GENERIC_MESSAGE, requestId }),
        requestId,
      );
    }

    const json = await req.json().catch(() => null);
    const parsed = ForgotPasswordSchema.safeParse(json);

    if (!parsed.success) {
      return withRequestIdHeaders(
        NextResponse.json({ ok: true, message: GENERIC_MESSAGE }),
        requestId,
      );
    }

    const email = parsed.data.email.trim().toLowerCase();
    logInfo("auth.forgot_password.request_parsed", { requestId });

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });

    if (user) {
      logInfo("auth.forgot_password.user_found", { requestId, userId: user.id });
      await prisma.passwordResetToken.updateMany({
        where: { userId: user.id, usedAt: null, expiresAt: { gt: new Date() } },
        data: { usedAt: new Date() },
      });

      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = sha256Hex(rawToken);
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

      await prisma.passwordResetToken.create({
        data: {
          tokenHash,
          userId: user.id,
          expiresAt,
        },
        select: { id: true },
      });

      logInfo("auth.forgot_password.token_created", {
        requestId,
        userId: user.id,
        expiresAt: expiresAt.toISOString(),
      });

      const appUrl = getAppUrl();
      const resetUrl = `${appUrl.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(rawToken)}`;

      const emailTpl = buildPasswordResetEmail({ resetUrl });

      sendEmail({
        to: user.email,
        subject: emailTpl.subject,
        text: emailTpl.text,
        html: emailTpl.html,
      }).then((result) => {
        if (!result.ok) {
          logError("auth.forgot_password.email_failed", {
            requestId,
            userId: user.id,
            error: result.error,
          });
          return;
        }

        logInfo("auth.forgot_password.email_sent", { requestId, userId: user.id });
      });
    } else {
      logInfo("auth.forgot_password.user_not_found", { requestId });
    }

    return withRequestIdHeaders(
      NextResponse.json({ ok: true, message: GENERIC_MESSAGE }),
      requestId,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    logError("auth.forgot_password.server_error", { requestId, error: message });
    return withRequestIdHeaders(
      NextResponse.json({ ok: true, message: GENERIC_MESSAGE }),
      requestId,
    );
  }
}
