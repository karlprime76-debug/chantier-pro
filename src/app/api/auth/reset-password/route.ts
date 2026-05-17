import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";

import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { sendTransactionalEmail } from "@/lib/email/resend";
import { SITE_CONFIG } from "@/lib/site-config";
import { logError, logInfo } from "@/lib/observability/logger";
import { getRequestId, withRequestIdHeaders } from "@/lib/observability/requestId";

const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function POST(req: Request) {
  const requestId = getRequestId(req);
  try {
    logInfo("auth.reset_password.request_received", { requestId });
    const json = await req.json().catch(() => null);
    const parsed = ResetPasswordSchema.safeParse(json);

    if (!parsed.success) {
      return withRequestIdHeaders(
        NextResponse.json(
          { ok: false, message: "Lien de réinitialisation invalide.", requestId },
          { status: 400 },
        ),
        requestId,
      );
    }

    const tokenHash = sha256Hex(parsed.data.token);

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        userId: true,
        expiresAt: true,
        usedAt: true,
        user: { select: { id: true, email: true } },
      },
    });

    if (!resetToken) {
      logInfo("auth.reset_password.token_invalid", { requestId, reason: "not_found" });
      return withRequestIdHeaders(
        NextResponse.json(
          { ok: false, message: "Lien de réinitialisation invalide ou expiré.", requestId },
          { status: 400 },
        ),
        requestId,
      );
    }

    if (resetToken.usedAt) {
      logInfo("auth.reset_password.token_invalid", {
        requestId,
        reason: "already_used",
        userId: resetToken.userId,
      });
      return withRequestIdHeaders(
        NextResponse.json(
          { ok: false, message: "Lien de réinitialisation invalide ou expiré.", requestId },
          { status: 400 },
        ),
        requestId,
      );
    }

    if (resetToken.expiresAt <= new Date()) {
      logInfo("auth.reset_password.token_invalid", { requestId, reason: "expired", userId: resetToken.userId });
      return withRequestIdHeaders(
        NextResponse.json(
          { ok: false, message: "Lien de réinitialisation invalide ou expiré.", requestId },
          { status: 400 },
        ),
        requestId,
      );
    }

    const passwordHash = await hashPassword(parsed.data.password);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
        select: { id: true },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
        select: { id: true },
      }),
      prisma.passwordResetToken.updateMany({
        where: { userId: resetToken.userId, usedAt: null, expiresAt: { gt: new Date() } },
        data: { usedAt: new Date() },
      }),
    ]);

    logInfo("auth.reset_password.password_updated", { requestId, userId: resetToken.userId });

    if (resetToken.user?.email) {
      sendTransactionalEmail({
        to: resetToken.user.email,
        subject: "Votre mot de passe Chantier Pro a été modifié",
        text: `Bonjour,\n\nVotre mot de passe a bien été modifié.\n\nSi vous n’êtes pas à l’origine de cette action, contactez rapidement le support.\n\nChantier Pro — Outils professionnels pour le chantier\n${SITE_CONFIG.supportEmail}`,
        html: `<p>Bonjour,</p><p>Votre mot de passe a bien été modifié.</p><p>Si vous n’êtes pas à l’origine de cette action, contactez rapidement le support : <a href="mailto:${SITE_CONFIG.supportEmail}">${SITE_CONFIG.supportEmail}</a>.</p><p><strong>Chantier Pro</strong> — Outils professionnels pour le chantier</p>`,
      }).then((result) => {
        if (!result.ok) {
          logError("auth.reset_password.confirmation_email_failed", {
            requestId,
            userId: resetToken.userId,
            error: result.error,
          });
          return;
        }

        logInfo("auth.reset_password.confirmation_email_sent", {
          requestId,
          userId: resetToken.userId,
          provider: result.provider,
          id: result.id,
        });
      });
    }

    return withRequestIdHeaders(
      NextResponse.json({ ok: true, message: "Votre mot de passe a été réinitialisé.", requestId }),
      requestId,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    logError("auth.reset_password.server_error", { requestId, error: message });
    return withRequestIdHeaders(
      NextResponse.json({ ok: false, message: "Erreur serveur. Réessaie.", requestId }, { status: 500 }),
      requestId,
    );
  }
}
