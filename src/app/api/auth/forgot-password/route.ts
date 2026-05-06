import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";

import { prisma } from "@/lib/db/prisma";
import { getAppUrl, sendEmail } from "@/lib/email/sendEmail";

const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

const GENERIC_MESSAGE =
  "Si un compte existe avec cet email, un lien de réinitialisation sera envoyé.";

function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function POST(req: Request) {
  try {
    console.info("[forgot-password] request received");
    const json = await req.json().catch(() => null);
    const parsed = ForgotPasswordSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ ok: true, message: GENERIC_MESSAGE });
    }

    const email = parsed.data.email.trim().toLowerCase();
    console.info("[forgot-password] request parsed", { email });

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });

    if (user) {
      console.info("[forgot-password] user found", { userId: user.id });
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

      console.info("[forgot-password] token created", { userId: user.id, expiresAt: expiresAt.toISOString() });

      const appUrl = getAppUrl();
      const resetUrl = `${appUrl.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(rawToken)}`;

      const text = `Bonjour,\n\nVous avez demandé à réinitialiser votre mot de passe.\n\nCliquez sur le lien ci-dessous pour choisir un nouveau mot de passe :\n${resetUrl}\n\nCe lien expire dans 30 minutes.\n\nSi vous n’êtes pas à l’origine de cette demande, ignorez cet email.\n\nL’équipe Chantier Pro.`;

      const html = `<p>Bonjour,</p><p>Vous avez demandé à réinitialiser votre mot de passe.</p><p>Cliquez sur le lien ci-dessous pour choisir un nouveau mot de passe :</p><p><a href="${resetUrl}">Réinitialiser mon mot de passe</a></p><p>Ce lien expire dans 30 minutes.</p><p>Si vous n’êtes pas à l’origine de cette demande, ignorez cet email.</p><p>L’équipe Chantier Pro.</p>`;

      sendEmail({
        to: user.email,
        subject: "Réinitialisation de votre mot de passe Chantier Pro",
        text,
        html,
      }).then((result) => {
        if (!result.ok) {
          console.error("[forgot-password] reset email failed.", { userId: user.id, error: result.error });
          return;
        }

        console.info("[forgot-password] reset email sent", { userId: user.id });
      });
    } else {
      console.info("[forgot-password] user not found");
    }

    return NextResponse.json({ ok: true, message: GENERIC_MESSAGE });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    console.error("[forgot-password] server error", { error: message });
    return NextResponse.json({ ok: true, message: GENERIC_MESSAGE });
  }
}
