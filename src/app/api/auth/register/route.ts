import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { getAppUrl, sendEmail } from "@/lib/email/sendEmail";

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => null);
    const parsed = RegisterSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "invalid_payload", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const email = parsed.data.email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) {
      return NextResponse.json({ ok: false, error: "email_already_used" }, { status: 409 });
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

    const appUrl = getAppUrl();
    const dashboardUrl = `${appUrl.replace(/\/$/, "")}/dashboard`;

    const welcomeText = `Bonjour ${userName || ""},\n\nBienvenue sur Chantier Pro.\nVotre compte a été créé avec succès.\n\nVous pouvez maintenant accéder à votre espace personnel et gérer vos informations depuis votre tableau de bord.\n\nAccéder à mon espace :\n${dashboardUrl}\n\nL’équipe Chantier Pro.`;

    const welcomeHtml = `<p>Bonjour ${userName || ""},</p><p>Bienvenue sur Chantier Pro.<br/>Votre compte a été créé avec succès.</p><p>Vous pouvez maintenant accéder à votre espace personnel et gérer vos informations depuis votre tableau de bord.</p><p><a href="${dashboardUrl}">Accéder à mon espace</a></p><p>L’équipe Chantier Pro.</p>`;

    sendEmail({
      to: email,
      subject: "Bienvenue sur Chantier Pro",
      text: welcomeText,
      html: welcomeHtml,
    }).then((result) => {
      if (!result.ok) {
        console.error("[register] Welcome email failed.", { userId: user.id, error: result.error });
      }
    });

    return NextResponse.json({ ok: true, userId: user.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json(
      { ok: false, error: "server_error", message },
      { status: 500 },
    );
  }
}
