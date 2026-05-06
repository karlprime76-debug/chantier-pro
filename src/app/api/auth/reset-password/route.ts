import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";

import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { sendEmail } from "@/lib/email/sendEmail";

const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function POST(req: Request) {
  try {
    console.info("[reset-password] request received");
    const json = await req.json().catch(() => null);
    const parsed = ResetPasswordSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: "Lien de réinitialisation invalide." },
        { status: 400 },
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
      console.info("[reset-password] token invalid", { reason: "not_found" });
      return NextResponse.json(
        { ok: false, message: "Lien de réinitialisation invalide ou expiré." },
        { status: 400 },
      );
    }

    if (resetToken.usedAt) {
      console.info("[reset-password] token invalid", { reason: "already_used", userId: resetToken.userId });
      return NextResponse.json(
        { ok: false, message: "Lien de réinitialisation invalide ou expiré." },
        { status: 400 },
      );
    }

    if (resetToken.expiresAt <= new Date()) {
      console.info("[reset-password] token invalid", { reason: "expired", userId: resetToken.userId });
      return NextResponse.json(
        { ok: false, message: "Lien de réinitialisation invalide ou expiré." },
        { status: 400 },
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

    console.info("[reset-password] password updated", { userId: resetToken.userId });

    if (resetToken.user?.email) {
      const text = `Bonjour,\n\nVotre mot de passe a bien été modifié.\n\nSi vous n’êtes pas à l’origine de cette action, contactez rapidement le support.\n\nL’équipe Chantier Pro.`;

      const html = `<p>Bonjour,</p><p>Votre mot de passe a bien été modifié.</p><p>Si vous n’êtes pas à l’origine de cette action, contactez rapidement le support.</p><p>L’équipe Chantier Pro.</p>`;

      sendEmail({
        to: resetToken.user.email,
        subject: "Votre mot de passe Chantier Pro a été modifié",
        text,
        html,
      }).then((result) => {
        if (!result.ok) {
          console.error("[reset-password] confirmation email failed.", {
            userId: resetToken.userId,
            error: result.error,
          });
          return;
        }

        console.info("[reset-password] confirmation email sent", { userId: resetToken.userId });
      });
    }

    return NextResponse.json({ ok: true, message: "Votre mot de passe a été réinitialisé." });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    console.error("[reset-password] server error", { error: message });
    return NextResponse.json({ ok: false, message: "Erreur serveur. Réessaie." }, { status: 500 });
  }
}
